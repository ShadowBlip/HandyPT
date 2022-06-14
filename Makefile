# Source files
TS_FILES := $(shell find src -name *.ts)
TSX_FILES := $(shell find src -name *.tsx)
SRC_FILES := $(TS_FILES) $(TSX_FILES) plugin.toml

# Crankshaft
CRANKSHAFT_DATA_PATH ?= .var/app/space.crankshaft.Crankshaft/data/crankshaft

# SSH Configuration
SSH_USER ?= gamer
SSH_HOST ?= 192.168.0.115
SSH_MOUNT_PATH ?= /tmp/remote
SSH_CRANKSHAFT_DATA_PATH ?= /home/$(SSH_USER)/$(CRANKSHAFT_DATA_PATH)

# Default target is to build and restart crankshaft
.PHONY: default
default: build restart

.PHONY: build
build: dist ## Builds the project

dist: $(SRC_FILES) node_modules
	npm run build

.PHONY: watch
watch: ## Build and watch for source code changes
	npm run build-watch

package-lock.json: package.json
	npm i

node_modules: node_modules/installed ## Install dependencies
node_modules/installed: package-lock.json
	npm ci
	touch $@

.PHONY: restart
restart: ## Restart crankshaft
	systemctl --user restart crankshaft

.PHONY: debug
debug: ## Show Makefile variables
	@echo "Source Files: $(SRC_FILES)"

.PHONY: cef-debug
cef-debug: ## Open Chrome CEF debugging. Add a network target: localhost:8080
	google-chrome-stable "chrome://inspect/#devices"

.PHONY: tunnel
tunnel: ## Create an SSH tunnel to remote Steam Client (accessible on localhost:4040)
	ssh $(SSH_USER)@$(SSH_HOST) -N -f -L 4040:localhost:8080

# Mounts the remote device and creates an SSH tunnel for CEF access
$(SSH_MOUNT_PATH):
	mkdir -p $(SSH_MOUNT_PATH)
	sshfs -o default_permissions $(SSH_USER)@$(SSH_HOST):$(SSH_CRANKSHAFT_DATA_PATH) $(SSH_MOUNT_PATH)
	$(MAKE) tunnel

# Cleans and transfers the project
$(SSH_MOUNT_PATH)/plugins/$(shell basename $(PWD)): $(SRC_FILES)
	rm -rf $(SSH_MOUNT_PATH)/plugins/$(shell basename $(PWD))
	cp -r $(PWD) $(SSH_MOUNT_PATH)/plugins/

.PHONY: remote-restart
remote-restart: ## Restart remote crankshaft
	ssh $(SSH_USER)@$(SSH_HOST) systemctl --user restart crankshaft

.PHONY: remote-update
remote-update: dist $(SSH_MOUNT_PATH) $(SSH_MOUNT_PATH)/plugins/$(shell basename $(PWD)) remote-restart ## Remotely updates

.PHONY: help
help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
