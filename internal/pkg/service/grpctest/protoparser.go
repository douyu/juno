package grpctest

import (
	"os"
	"path/filepath"
	"strings"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/jhump/protoreflect/desc"
	"github.com/jhump/protoreflect/desc/protoparse"
)

// example:
//	proto := /home/www/server/fun-ProtoParser/fun/comment/srv/comment/comment.proto
//  ParseProto(proto)
func ParseProto(basePath, proto string) {
	pp := &protoparse.Parser{
		ImportPaths:           []string{filepath.Dir(proto), basePath},
		IncludeSourceCodeInfo: true,
	}

	filename := filepath.Base(proto)
	fds, err := pp.ParseFiles(filename)
	if err != nil {
		xlog.Error("parse ProtoParser error", xlog.String("err", err.Error()))
		return
	}

	if len(fds) > 0 {
		saveProto(fds[0].GetServices(), proto)
	}
}

func ParseAllProto(basePath, targetPath string) (err error) {
	protoNames, err := filterAllProto(targetPath)
	if err != nil {
		return
	}

	for _, proto := range protoNames {
		ParseProto(basePath, proto)
	}
	return
}

// 筛选Proto文件
func filterAllProto(dirPath string) (protoNames []string, err error) {
	fileNames, err := allSubFiles(dirPath)
	// 筛选出proto文件
	protoNames = make([]string, 0)
	for _, fileName := range fileNames {
		if strings.HasSuffix(fileName, ".proto") {
			protoNames = append(protoNames, fileName)
		}
	}
	return
}

// 所有文件夹下的文件
func allSubFiles(dirPath string) (fileNames []string, err error) {
	fi, err := os.Stat(dirPath)
	if err != nil {
		return
	}
	if !fi.IsDir() {
		return
	}

	d, err := os.Open(dirPath)
	if err != nil {
		return
	}
	defer d.Close()

	fis, err := d.Readdir(-1)
	if err != nil {
		return
	}

	fileNames = make([]string, 0)
	for _, fi = range fis {
		fileName := fi.Name()
		if fileName == "." || fileName == ".." {
			continue
		}
		if !fi.IsDir() {
			fileNames = append(fileNames, filepath.Join(dirPath, fileName))
		} else {
			subPath := filepath.Join(dirPath, fileName)

			tmpArr, err := allSubFiles(subPath)

			if err != nil {
				continue
			}
			fileNames = append(fileNames, tmpArr...)
		}
	}

	return
}

func saveProto(services []*desc.ServiceDescriptor, protoFileName string) {
	for _, service := range services {
		for _, method := range service.GetMethods() {
			// update/create record
			saveProtoMethod(service, method, protoFileName)
		}
	}

	return
}

func saveProtoMethod(service *desc.ServiceDescriptor, method *desc.MethodDescriptor, protoFileName string) {
	// 只存相对路径
	protoFileName, _ = filepath.Rel(option.ProtoDir, protoFileName)

	proto := db.GrpcProto{}
	option.DB.Where("file_name = ?", protoFileName).Last(&proto)
	{
		proto.FileName = protoFileName
		proto.PackageName = service.GetFile().GetPackage()
	}
	err := option.DB.Save(&proto).Error
	if err != nil {
		xlog.Error("save proto failed", xlog.String("err", err.Error()))
		return
	}

	protoService := db.GrpcProtoService{}
	option.DB.Where("proto_id = ? and name = ?", proto.ID, service.GetName()).Last(&protoService)
	{
		protoService.ProtoID = proto.ID
		protoService.Name = service.GetName()
	}
	err = option.DB.Save(&protoService).Error
	if err != nil {
		xlog.Error("save protoService failed", xlog.String("err", err.Error()))
		return
	}

	protoMethod := db.GrpcServiceMethod{}
	option.DB.Where("service_id = ? and name = ?", protoService.ID, method.GetName()).Last(&protoMethod)
	{
		protoMethod.ServiceID = protoService.ID
		protoMethod.Name = method.GetName()
		protoMethod.InputName = method.GetInputType().GetName()
		protoMethod.InputType = MessageParser(method.GetInputType())
		protoMethod.OutputName = method.GetOutputType().GetName()
		protoMethod.OutputType = MessageParser(method.GetOutputType())
		protoMethod.MethodComment = getMethodComment(method)
	}
	err = option.DB.Save(&protoMethod).Error
	if err != nil {
		xlog.Error("save service method failed", xlog.String("err", err.Error()))
		return
	}
}

func getMethodComment(method *desc.MethodDescriptor) string {
	comments := ""
	methodSourceInfo := method.GetSourceInfo()
	if methodSourceInfo != nil {
		if methodSourceInfo.LeadingComments != nil {
			comments += strings.Trim(*methodSourceInfo.LeadingComments, "\n\t ")
		}
		if methodSourceInfo.TrailingComments != nil {
			comments += strings.Trim(*methodSourceInfo.TrailingComments, "\n\t ")
		}
	}
	return comments
}

//MessageParser 解析 Proto 结构描述
func MessageParser(desc *desc.MessageDescriptor) db.ProtoFields {
	if desc == nil {
		return nil
	}

	fieldsParsed := make(db.ProtoFields)
	fields := desc.GetFields()
	for _, field := range fields {
		fieldType := db.ProtoField{
			JsonName:    field.GetJSONName(),
			Type:        int32(field.GetType()),
			Label:       int32(field.GetLabel()),
			IsRepeated:  field.IsRepeated(),
			Number:      field.GetNumber(),
			MessageType: MessageParser(field.GetMessageType()),
		}
		sourceInfo := field.GetSourceInfo()
		if sourceInfo != nil && sourceInfo.LeadingComments != nil {
			fieldType.Comment = strings.Trim(*sourceInfo.LeadingComments, " \n\t")
		}
		fieldsParsed[field.GetName()] = fieldType
	}
	return fieldsParsed
}
