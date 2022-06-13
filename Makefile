TS_FILES := $(shell find src -name *.ts)
TSX_FILES := $(shell find src -name *.tsx)
SRC_FILES := $(TS_FILES) $(TSX_FILES)

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

.PHONY: help
help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
