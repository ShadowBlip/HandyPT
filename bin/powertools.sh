#!/bin/bash
smtOn() {
  /usr/bin/echo on > /sys/devices/system/cpu/smt/control
}

smtOff() {
  /usr/bin/echo off > /sys/devices/system/cpu/smt/control
}

if [[ $1 == "smtOn" ]]; then
  smtOn

elif [[ $1 == "smtOff" ]]; then
  smtOff
fi
