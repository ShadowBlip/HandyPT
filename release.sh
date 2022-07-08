#!/bin/bash
rm -rfv ~/builds/HandyPT/*
cp -R configure.sh bin/ dist handypt_sudo node_modules package.json package-lock.json plugin.toml preact-shim.js src tsconfig.json yarn.lock ~/builds/HandyPT
cd ~/builds
tar -czvf handy_pt-v0.1.1.tar.gz HandyPT 

