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

intelSetTDPLong(){
  /usr/bin/echo $2 > /sys/class/powercap/intel-rapl/intel-rapl:0/constraint_0_power_limit_uw
}

intelSetTDPShort(){
  /usr/bin/echo $2 > /sys/class/powercap/intel-rapl/intel-rapl:0/constraint_1_power_limit_uw
}

intelSetTDPPeak(){
  /usr/bin/echo $2 > /sys/class/powercap/intel-rapl/intel-rapl:0/constraint_2_power_limit_uw
}

if [[ $1 == "smtOn" ]]; then
  smtOn
elif [[ $1 == "smtOff" ]]; then
  smtOff
elif [[ $1 == "cpuBoostOn" ]]; then
  cpuBoostOn
elif [[ $1 == "cpuBoostOff" ]]; then
  cpuBoostOff
elif [[ $1 == "constraint_0_power_limit_uw" ]]; then
  intelSetTDPLong
elif [[ $1 == "constraint_1_power_limit_uw" ]]; then
  intelSetTDPShort
elif [[ $1 == "constraint_2_power_limit_uw" ]]; then
  intelSetTDPPeak
fi


