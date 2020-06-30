package notify

import (
	"bytes"
	"context"
	"fmt"
	"io/ioutil"
	"net/http/httptest"
	"strconv"
	"sync"
	"time"

	"github.com/douyu/juno/pb"
	"github.com/douyu/juno/pkg/constx"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"go.uber.org/zap"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

var StreamStore *streamStore

type streamStore struct {
	store  map[string]*proxyStream
	router *echo.Echo
	path   string
}

func InitStreamStore(clientMap map[string]pb.ProxyClient) {
	obj := &streamStore{
		store: make(map[string]*proxyStream, 0),
	}
	for key, client := range clientMap {
		obj.store[key] = initProxyStream(client)
	}
	obj.router = echo.New()
	obj.path = "/heartbeat"
	StreamStore = obj
}

func (s *streamStore) AddRouter(handlerFunc echo.HandlerFunc) {
	s.router.POST(s.path, handlerFunc)
}

type proxyStream struct {
	sync.Mutex
	stream    pb.Proxy_NotifyClient
	proxyChan chan pb.NotifyReq
}

func initProxyStream(client pb.ProxyClient) *proxyStream {
	obj := &proxyStream{
		proxyChan: make(chan pb.NotifyReq, 1000),
	}
	obj.PushChan(pb.NotifyReq{
		MsgId: constx.MsgConnectReq,
	})
	obj.syncProxy(client)
	return obj
}

func (c *proxyStream) PushChan(info pb.NotifyReq) {
	c.proxyChan <- info
}

func getClientAddrContext(ctx context.Context, gid uint32) (context.Context, metadata.MD) {
	md, ok := metadata.FromOutgoingContext(ctx)
	clientAddrMD := metadata.Pairs("gid", strconv.Itoa(int(gid)))
	if ok { //user 自定义metadata
		md = metadata.Join(md, clientAddrMD)
	} else {
		md = clientAddrMD
	}
	return metadata.NewOutgoingContext(ctx, md), md
}

func (c *proxyStream) GetStream(client pb.ProxyClient) pb.Proxy_NotifyClient {
	c.Lock()
	defer c.Unlock()
	if c.stream != nil {
		return c.stream
	}
	ctx, _ := getClientAddrContext(context.Background(), 1)
	for {
		stream, err := client.Notify(ctx)
		if err != nil {
			fmt.Printf("get game stream failed. %s", err.Error())
			time.Sleep(1 * time.Second)
		} else {
			c.stream = stream
			break
		}
	}

	return c.stream
}

func (c *proxyStream) syncProxy(client pb.ProxyClient) {
	// 监听服务端通知
	go func() {
		var (
			reply *pb.NotifyResp
			err   error
		)
		for {
			reply, err = c.GetStream(client).Recv()
			reply_status, _ := status.FromError(err)
			if err != nil && reply_status.Code() == codes.Unavailable {
				log.Error("与服务器的连接被断开, 进行重试")
				time.Sleep(time.Second)
				c.stream = nil
				continue
			}
			xlog.Info("sync proxy info", zap.Uint32("msg id", reply.MsgId), zap.String("msg info", string(reply.Msg)))
			if reply.Code == 0 {
				StreamStore.PostForm(reply.Msg)
				//switch reply.MsgId {
				//case common.MsgBattleBroadResp:
				//	Frontend.OutputRaw(ConnManage.GetConn(reply.ConnId), reply.Code, reply.MsgId, []byte(reply.Msg))
				//case common.MsgTableRoomResp:
				//	Frontend.OutputRaw(ConnManage.GetConn(reply.ConnId), reply.Code, reply.MsgId, []byte(reply.Msg))
				//}
			}

		}
	}()

	// 发送给PROXY数据
	go func() {
		var (
			err error
		)
		for {
			data := <-c.proxyChan
			err = c.GetStream(client).Send(&data)
			if err != nil {
				log.Error(fmt.Sprintf("there was error sending data. %s", err.Error()))
				continue
			}
		}
	}()
}

func (s *streamStore) PostForm(param []byte) []byte {
	// 构造post请求
	req := httptest.NewRequest("POST", s.path, bytes.NewReader(param))
	req.Header.Set("Content-Type", "application/json")

	// 初始化响应
	w := httptest.NewRecorder()

	// 调用相应handler接口
	s.router.ServeHTTP(w, req)

	// 提取响应
	result := w.Result()
	defer result.Body.Close()

	// 读取响应body
	body, _ := ioutil.ReadAll(result.Body)
	return body
}
