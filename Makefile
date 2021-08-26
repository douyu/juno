# Jupiter Golang Application Standard Makefile
SHELL:=/bin/bash
BASE_PATH:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
SCRIPT_PATH:=$(BASE_PATH)/script
JUNO_NAME:=juno
JUNO_ADMIN_NAME:=juno-admin
JUNO_PROXY_NAME:=juno-proxy
COMPILE_OUT:=$(BASE_PATH)/release
APP_VERSION:=0.4.0

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
	@go run cmd/juno-admin/main.go --config=config/single-region-admin.toml --host 0.0.0.0

run.multiple-region-admin:
	@go run cmd/juno-admin/main.go --config=config/multiple-region-admin.toml
run.multiple-region-proxy:
	@go run cmd/juno-proxy/main.go --config=config/multiple-region-proxy.toml

docker:
	@docker-compose -f ./build/docker/standalone.yaml up

all:print fmt lint build_all

print:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making print<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
	@echo SHELL:$(SHELL)
	@echo BASE_PATH:$(BASE_PATH)
	@echo SCRIPT_PATH:$(SCRIPT_PATH)
	@echo JUNO_NAME:$(JUNO_NAME)
	@echo -e "\n"

fmt:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making fmt<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
	go fmt $(JUNO_NAME)/internal/...
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

build_all:build_clear build_admin build_proxy build_assets build_data tar

build_clear:
	rm -rf release

build_admin:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making build juno admin<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
	@chmod +x $(SCRIPT_PATH)/build/*.sh
	@cd $(BASE_PATH)/cmd/juno-admin && $(SCRIPT_PATH)/build/gobuild.sh $(JUNO_ADMIN_NAME) $(COMPILE_OUT) $(APP_VERSION)
	@echo -e "\n"

build_proxy:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making build juno proxy<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
	@chmod +x $(SCRIPT_PATH)/build/*.sh
	@cd $(BASE_PATH)/cmd/juno-proxy && $(SCRIPT_PATH)/build/gobuild.sh $(JUNO_PROXY_NAME) $(COMPILE_OUT) $(APP_VERSION)
	@echo -e "\n"

build_assets:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making build assets<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
	@cd $(BASE_PATH)/assets && yarn run build
	@echo -e "\n"

build_data:
	@echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>making build data<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
	@chmod +x $(SCRIPT_PATH)/build/*.sh
	@$(SCRIPT_PATH)/build/build_data.sh $(JUNO_NAME) $(APP_VERSION) $(BASE_PATH) $(COMPILE_OUT)/$(APP_VERSION)
	@echo -e "\n"

tar:
	@cd $(BASE_PATH)/release && tar zcvf juno_$(APP_VERSION).tar.gz $(APP_VERSION)
zippub:
	zip -r juno-admin.zip bin config data assets/dist
buildpub:
	go build -o ./bin/juno-admin ./cmd/juno-admin
