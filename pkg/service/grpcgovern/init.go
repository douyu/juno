package grpcgovern

var IGrpcGovern *GrpcGovern

func Init() {
	IGrpcGovern = InitGrpcGovern()
}
