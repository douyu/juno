# Jupiter Golang Application Standard Makefile
SHELL:=/bin/bash
BASE_PATH:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
BUILD_PATH:=$(BASE_PATH)/build
APP_NAME:=$(shell basename $(BASE_PATH))
COMPILE_OUT:=$(BASE_PATH)/release
APP_VERSION:=0.2.0

.DEFAULT_GOAL := default
.PHONY: run run.grpc run.npm


########################################################
database.install:
	@go run cmd/juno-admin/main.go --config=config/install.toml --install=true
database.clear:
	@go run cmd/juno-admin/main.go --config=config/install.toml --clear=true
database.mock:
	@go run cmd/juno-admin/main.go --config=config/install.toml --mock=true
database.debug: database.clear database.install database.mock

run.single-region-admin:
	@go run cmd/juno-admin/main.go --config=config/single-region-admin.toml

run.multiple-region-admin:
	@go run cmd/juno-admin/main.go --config=config/multiple-region-admin.toml
run.multiple-region-proxy:
	@go run cmd/juno-proxy/main.go --config=config/multiple-region-proxy.toml

docker:
	@docker-compose -f ./build/docker/standalone.yaml up

docker.build.run:
	@./docker/run.sh



all:print fmt lint buildall
alltar:print fmt lint buildall

print:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making print<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
	@echo SHELL:$(SHELL)
	@echo BASE_PATH:$(BASE_PATH)
	@echo BUILD_PATH:$(BUILD_PATH)
	@echo APP_NAME:$(APP_NAME)
	@echo BUILD_TIME:$(BUILD_TIME)
	@echo JUPITER:$(JUPITER)
	@echo BINS:$(BINS)
	@echo APP_NAME:$(APP_NAME)
	@echo LDFLAGS:$(LDFLAGS)
	@echo -e "\n"

fmt:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making fmt<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
	go fmt $(APP_NAME)/internal/...
	@echo -e "\n"

lint:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making lint<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
ifndef REVIVE
	go get -u github.com/mgechev/revive
endif
	revive -formatter stylish internal/...
	@echo -e "\n"

errcheck:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making errcheck<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
ifndef ERRCHCEK
	go get -u github.com/kisielk/errcheck
endif
	@errcheck internal/...
	@echo -e "\n"

test:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making test<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
	@echo testPath ${BAST_PATH}
	go test -v .${BAST_PATH}/...

build_all:build_admin build_proxy build_data


build_admin:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making build juno admin<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
	@chmod +x $(BUILD_PATH)/script/shell/*.sh
	@cd cmd/juno-admin && $(BUILD_PATH)/script/shell/gobuild.sh $(APP_NAME) $(COMPILE_OUT) $(APP_VERSION)
	@echo -e "\n"

build_proxy:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making build juno proxy<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
	@chmod +x $(BUILD_PATH)/script/shell/*.sh
	@cd cmd/juno-proxy && $(BUILD_PATH)/script/shell/gobuild.sh $(APP_NAME) $(COMPILE_OUT) $(APP_VERSION)
	@echo -e "\n"

build_data:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making build<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
	@chmod +x $(BUILD_PATH)/script/shell/*.sh
	@$(BUILD_PATH)/script/shell/build_data.sh $(APP_NAME) $(APP_VERSION) $(BASE_PATH) $(COMPILE_OUT)/$(APP_VERSION)
	@echo -e "\n"

run:
	go run cmd/main.go --config=config/config.toml


