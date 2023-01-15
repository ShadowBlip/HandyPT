# Configuration settings
PLUGIN_NAME ?= HandyPT
PLUGIN_VERSION ?= 0.4.0

# Source files
TS_FILES := $(shell find src -name *.ts)
TSX_FILES := $(shell find src -name *.tsx)
SRC_FILES := $(TS_FILES) $(TSX_FILES) plugin.json

# Output files to include in tar.gz
TAR_FILES := dist plugin.toml bin

# Crankshaft
DATA_PATH ?= homebrew

# SSH Configuration
SSH_USER ?= gamer
SSH_HOST ?= 192.168.0.246
SSH_MOUNT_PATH ?= /tmp/remote
SSH_DATA_PATH ?= /home/$(SSH_USER)/$(DATA_PATH)

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

$(SSH_MOUNT_PATH)/.mounted:
	mkdir -p $(SSH_MOUNT_PATH)
	sshfs -o default_permissions $(SSH_USER)@$(SSH_HOST):$(SSH_DATA_PATH) $(SSH_MOUNT_PATH)
	touch $(SSH_MOUNT_PATH)/.mounted
	$(MAKE) tunnel

# Cleans and transfers the project
$(SSH_MOUNT_PATH)/plugins/$(PLUGIN_NAME): $(SRC_FILES)
	rm -rf $(SSH_MOUNT_PATH)/plugins/$(PLUGIN_NAME)
	mkdir -p $(SSH_MOUNT_PATH)/plugins/$(PLUGIN_NAME)
	cp -r $(TAR_FILES) $(SSH_MOUNT_PATH)/plugins/$(PLUGIN_NAME)

# Cleans and transfers the project
#$(SSH_MOUNT_PATH)/plugins/$(PLUGIN_NAME): $(SRC_FILES)
#	rsync -avh $(PWD)/ $(SSH_MOUNT_PATH)/plugins/$(PLUGIN_NAME) --delete

.PHONY: remote-restart
remote-restart: ## Restart remote crankshaft
	ssh $(SSH_USER)@$(SSH_HOST) systemctl --user restart crankshaft

.PHONY: remote-update
remote-update: dist $(SSH_MOUNT_PATH)/.mounted $(SSH_MOUNT_PATH)/plugins/$(PLUGIN_NAME) remote-restart

.PHONY: clean
clean: ## Clean all build artifacts
	rm -rf build dist

.PHONY: help
help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

