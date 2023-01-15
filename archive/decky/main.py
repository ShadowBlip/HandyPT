import asyncio
import json
import os
import subprocess
import time
import util

from pathlib import Path

VERSION = "0.0.0"
HOME_DIR = os.getenv("HOME")
SETTINGS_LOCATION = HOME_DIR + "/.config/plugins/hpt-settings.json"
LOG_LOCATION = HOME_DIR + "/.config/plugins/hpt-stdout.log"
import logging

logging.basicConfig(
    filename=LOG_LOCATION,
    format="%(asctime)s %(levelname)s %(message)s",
    filemode="w",
    force=True,
)

logger = logging.getLogger()
logger.setLevel(logging.INFO)
logging.info(
    f"Handheld Power Tools v{VERSION} https://github.com/ShadowBlip/HandyPT"
)
startup_time = time.time()

amd_prop_dict = {
    "a": "0x0000", # STAPM LIMIT
    "b": "0x0008", # FAST PPT
    "c": "0x0010", # SLOW PPT
    }
intel_prop_dict = {
    "a": "contraint_0_power_limit_uw", # long_term
    "b": "contraint_1_power_limit_uw", # peak_power
    "c": "contraint_2_power_limit_uw", # short_term
    }

#powertools = Path('/tbd/') # Use polkit
class Plugin:
    modified_settings = False
    persistent = False
    def __init__()
        pass
        #TODO: ryzenadj controller client, persistance.
        ## startup: load & apply settings
        #if os.path.exists(SETTINGS_LOCATION):
        #    settings = read_json(SETTINGS_LOCATION)
        #    logging.info(f"Loaded settings from {SETTINGS_LOCATION}: {settings}")
        #else:
        #    settings = None
        #    logging.info(f"Settings {SETTINGS_LOCATION} does not exist, skipped")

        #if settings is None or settings["persistent"] == False:
        #    logging.info("Ignoring settings from file")
        #    self.persistent = False

        #else:
        #    # apply settings
        #    self.persistent = True
        #    logging.info(f"Restoring settings from file: {settings}")

        #    # GPU
        #    write_gpu_prop("a", settings["gpu"]["stapm"])
        #    write_gpu_prop("b", settings["gpu"]["slowppt"])
        #    write_gpu_prop("c", settings["gpu"]["fastppt"])
        #    self.tdp_delta = settings["gpu"]["tdp_delta"]

    async def _main(self):
        self.__init__()
        asyncio.sleep(5)

    async def get_bat_param(self, bat_path: str, param: str) -> int:
        return open(f'/sys/class/power_supply/{bat_path}/{param}', "r").read().strip()

    async def get_cpu_clk_range(self) -> dict:
        match await self.get_cpu_id():
            case _:
                return None

    async def get_cpu_id(self) -> str:
        return await self.get_cpu_info("model name")

    async def get_cpu_info(self, param: str) -> str:
        command = "cat /proc/cpuinfo"
        all_info = subprocess.check_output(command, shell=True).decode().strip()
        for line in all_info.split("\n"):
            if param in line:
                return line.split(":")[1].strip()
        return None

    async def get_cpu_vendor(self):
        return await self.get_cpu_info("vendor_id")

    async def get_gpu_clk_range(self):
        match await self.get_cpu_id():
            case _:
                return None

    async def get_tdp_range(self):
        match await self.get_cpu_id():
            case _:
                return None

    async def get_version(self) -> str:
        return VERSION

    async def read_amd_gpu_prop(self, prop: str) -> int:
        pass

    async def read_gpu_prop(self, prop: str) -> int:
        match await self.get_cpu_vendor():
            case "AuthenticAMD" | "AuthenticaMD Advanced Micro Devices, Inc.":
                return await self.read_amd_gpu_prop(prop)
            case "GenuineIntel":
                return await self.read_intel_gpu_prop(prop)
            case _:
                return None

    async def read_intel_prop(self, prop: str) -> int:
        command = intel_prop_dict[prop]
        return system_id = open("/sys/class/powercap/intel-rapl/intel-rapl:0/{command}", "r").read().strip()

    async def read_json(self, path: str):
        pass

    async def read_sys_id(slf) -> str:
        return system_id = open("/sys/devices/virtual/dmi/id/product_name", "r").read().strip()

    async def write_amd_prop(self, prop: str, value: int):
        pass

    async def write_cpu_prop(self, prop: str, value):
        # smt off|on, cpuBoost 0|1 intelSetTDP<Long|Short|Peak> value
        command = "sudo {powertools-path} {prop} {value}"
        result = subprocess.check_output(command, shell=True).decode().strip()

    async def write_gpu_prop(self, prop: str, value: int):
        match await self.get_cpu_vendor():
            case "AuthenticAMD" | "AuthenticaMD Advanced Micro Devices, Inc.":
                await self.write_amd_prop(prop, value)
            case "GenuineIntel":
                await self.write_intel_prop(prop, value)
            case _:
                pass

    async def write_intel_prop(self, prop: str, value: int):
        command = intel_prop_dict[prop]
        await self.write_cpu_prop(command, value)

    async def write_json(self, path, data):
        pass
