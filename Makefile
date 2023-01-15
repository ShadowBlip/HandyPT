PLUGIN_NAME ?= $(shell grep 'plugin\.id' plugin.json | awk '{print $$2}' | grep -o '"[^"]\+"' | sed 's/"//g')

OPENGAMEPAD_UI_BASE ?= ../OpenGamepadUI
PLUGINS_DIR := $(OPENGAMEPAD_UI_BASE)/plugins
BUILD_DIR := $(OPENGAMEPAD_UI_BASE)/build
INSTALL_DIR := $(HOME)/.local/share/godot/app_userdata/Open Gamepad UI/plugins

.PHONY: dist
dist: build
	mkdir -p dist
	touch dist/.gdignore
	cp $(BUILD_DIR)/plugins.zip dist/$(PLUGIN_NAME).zip
	cp plugin.json dist/$(PLUGIN_NAME).json

.PHONY: build
build: $(PLUGINS_DIR)/$(PLUGIN_NAME)
	@echo "Exporting plugin package"
	cd $(OPENGAMEPAD_UI_BASE) && $(MAKE) plugins

.PHONY: install
install: dist
	cp -r dist/* "$(INSTALL_DIR)"
	@echo "Installed plugin to $(INSTALL_DIR)"

$(PLUGINS_DIR)/$(PLUGIN_NAME):
	ln -s $(PWD) $(PLUGINS_DIR)/$(PLUGIN_NAME)

