#!/bin/bash
smtOn() {
  /usr/bin/echo on > /sys/devices/system/cpu/smt/control
}

smtOff() {
  /usr/bin/echo off > /sys/devices/system/cpu/smt/control
}

cpuBoostOn(){
  /usr/bin/echo 1 > /sys/devices/system/cpu/cpufreq/boost
}

cpuBoostOff(){
  /usr/bin/echo 0 > /sys/devices/system/cpu/cpufreq/boost
}

if [[ $1 == "smtOn" ]]; then
  smtOn
elif [[ $1 == "smtOff" ]]; then
  smtOff
elif [[ $1 == "cpuBoostOn" ]]; then
  cpuBoostOn
elif [[ $1 == "cpuBoostOff" ]]; then
  cpuBoostOff
fi


