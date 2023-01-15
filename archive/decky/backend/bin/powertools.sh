#!/bin/bash
smt() {
  /usr/bin/echo $2 > /sys/devices/system/cpu/smt/control
}

cpuBoost(){
  /usr/bin/echo $2 > /sys/devices/system/cpu/cpufreq/boost
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

if [[ $1 == "smt" ]]; then
  smt
elif [[ $1 == "cpuBoost" ]]; then
  cpuBoost
elif [[ $1 == "constraint_0_power_limit_uw" ]]; then
  intelSetTDPLong
elif [[ $1 == "constraint_1_power_limit_uw" ]]; then
  intelSetTDPShort
elif [[ $1 == "constraint_2_power_limit_uw" ]]; then
  intelSetTDPPeak
fi


