# Configuration settings
PLUGIN_NAME ?= $(shell basename $(PWD))
PLUGIN_VERSION ?= 0.2.0-dev

# Source files
TS_FILES := $(shell find src -name *.ts)
TSX_FILES := $(shell find src -name *.tsx)
SRC_FILES := $(TS_FILES) $(TSX_FILES) plugin.toml

# Output files to include in tar.gz
TAR_FILES := dist plugin.toml

# Crankshaft
CRANKSHAFT_DATA_PATH ?= .var/app/space.crankshaft.Crankshaft/data/crankshaft

# SSH Configuration
SSH_USER ?= gamer
SSH_HOST ?= 192.168.0.176
SSH_MOUNT_PATH ?= /tmp/remote
SSH_CRANKSHAFT_DATA_PATH ?= /home/$(SSH_USER)/$(CRANKSHAFT_DATA_PATH)

# Default target is to build and restart crankshaft
.PHONY: default
default: build restart

.PHONY: build
build: build/$(PLUGIN_NAME)-v$(PLUGIN_VERSION).tar.gz ## Builds the project
build/$(PLUGIN_NAME)-v$(PLUGIN_VERSION).tar.gz: dist
	mkdir -p build/$(PLUGIN_NAME)
	cp -R $(TAR_FILES) build/$(PLUGIN_NAME)
	cd build && tar -czvf $(PLUGIN_NAME)-v$(PLUGIN_VERSION).tar.gz $(PLUGIN_NAME)

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
	ssh $(SSH_USER)@$(SSH_HOST) systemctl --user restart crankshaft

.PHONY: debug
debug: ## Show Makefile variables
	@echo "Source Files: $(SRC_FILES)"

.PHONY: cef-debug
cef-debug: ## Open Chrome CEF debugging. Add a network target: localhost:8080
	chromium "chrome://inspect/#devices"

.PHONY: tunnel
tunnel: ## Create an SSH tunnel to remote Steam Client (accessible on localhost:4040)
	ssh $(SSH_USER)@$(SSH_HOST) -N -f -L 4040:localhost:8080

$(SSH_MOUNT_PATH):
	mkdir -p $(SSH_MOUNT_PATH)
	sshfs -o default_permissions $(SSH_USER)@$(SSH_HOST):$(SSH_CRANKSHAFT_DATA_PATH) $(SSH_MOUNT_PATH)
	$(MAKE) tunnel

$(SSH_MOUNT_PATH)/plugins/$(shell basename $(PWD)): $(SRC_FILES)
	rm -rf $(SSH_MOUNT_PATH)/plugins/$(shell basename $(PWD))
	cp -r $(PWD) $(SSH_MOUNT_PATH)/plugins/

# Cleans and transfers the project
#$(SSH_MOUNT_PATH)/plugins/$(PLUGIN_NAME): $(SRC_FILES)
#	rsync -avh $(PWD)/ $(SSH_MOUNT_PATH)/plugins/$(PLUGIN_NAME) --delete

.PHONY: remote-restart
remote-restart: ## Restart remote crankshaft
	ssh $(SSH_USER)@$(SSH_HOST) systemctl --user restart crankshaft

.PHONY: remote-update
#remote-update: dist $(SSH_MOUNT_PATH) $(SSH_MOUNT_PATH)/plugins/$(PLUGIN_NAME) remote-restart ## Remotely updates
remote-update: dist $(SSH_MOUNT_PATH) $(SSH_MOUNT_PATH)/plugins/$(shell basename $(PWD)) remote-restart
.PHONY: clean
clean: ## Clean all build artifacts
	rm -rf build dist

.PHONY: help
help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

