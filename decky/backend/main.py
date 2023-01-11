import time
import os
import json
import asyncio

from pathlib import Path
from subprocess import Popen, PIPE, STDOUT

VERSION = "0.0.1"
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

gpu_prop_dict = {
        "a": "0x0000", # STAPM LIMIT
        "b": "0x0008", # FAST PPT
        "c": "0x0010", # SLOW PPT
        }

class Plugin:

    gpuclk_notches = {}
    modified_settings = False
    persistent = False
    sys_id = None
    tdp_delta = 2
    tdp_notches = {}
    use_gpuclk = False

    # GPU stuff
    async def get_gpuclk_notches(self):
        if not self.sys_id:
            self.sys_id = read_sys_id()

        # Founders & 2021 MAX GPU CLK 1500, increment by 200Mhz
        if self.sys_id in [
            "AYANEO 2021",
            "AYA NEO 2021",
            "AYANEO FOUNDERS",
            "AYA NEO FOUNDERS",
            "AYANEO FOUNDER",
            "AYA NEO FOUNDER",
        ]:
            self.gpuclk_notches["gpuclk_notch0_val"] = 200
            self.gpuclk_notches["gpuclk_notch1_val"] = 400
            self.gpuclk_notches["gpuclk_notch2_val"] = 600
            self.gpuclk_notches["gpuclk_notch3_val"] = 800
            self.gpuclk_notches["gpuclk_notch4_val"] = 1000
            self.gpuclk_notches["gpuclk_notch5_val"] = 1200
            self.gpuclk_notches["gpuclk_notch6_val"] = 1500

        # 2021 PRO MAX GPU CLK 1750, increment by 250Mhz
        elif self.sys_id in [
            "AYANEO 2021 Pro Retro Power",
            "AYA NEO 2021 Pro Retro Power",
            "AYANEO 2021 Pro",
            "AYA NEO 2021 Pro",
        ]:
            self.gpuclk_notches["gpuclk_notch0_val"] = 250
            self.gpuclk_notches["gpuclk_notch1_val"] = 500
            self.gpuclk_notches["gpuclk_notch2_val"] = 750
            self.gpuclk_notches["gpuclk_notch3_val"] = 1000
            self.gpuclk_notches["gpuclk_notch4_val"] = 1250
            self.gpuclk_notches["gpuclk_notch5_val"] = 1500
            self.gpuclk_notches["gpuclk_notch6_val"] = 1750

        # NEXT MAX GPU CLK 2000, increment by 300Mhz
        elif self.sys_id in [
            "NEXT",
            "AYANEO NEXT",
            "AYA NEO NEXT",
            "NEXT Pro",
            "AYANEO NEXT Pro",
            "AYA NEO NEXT Pro",
        ]:
            self.gpuclk_notches["gpuclk_notch0_val"] = 250
            self.gpuclk_notches["gpuclk_notch1_val"] = 500
            self.gpuclk_notches["gpuclk_notch2_val"] = 800
            self.gpuclk_notches["gpuclk_notch3_val"] = 1100
            self.gpuclk_notches["gpuclk_notch4_val"] = 1400
            self.gpuclk_notches["gpuclk_notch5_val"] = 1700
            self.gpuclk_notches["gpuclk_notch6_val"] = 2000

        return self.gpuclk_notches

    async def get_tdp_delta(self):
        return self.tdp_delta

    async def set_tdp_delta(self, new_delta):
        logging.info("TDP Delta changed from "+str(self.tdp_delta)+" to "+str(new_delta))
        self.tdp_delta = new_delta
        self.modified_settings = True
        return True

    async def get_tdp_notches(self):
        if not self.sys_id:
            self.sys_id = read_sys_id()

        # Founders & 2021 MAX TDP 25W, increment by 3W
        if self.sys_id in [
            "AYANEO 2021",
            "AYA NEO 2021",
            "AYANEO FOUNDERS",
            "AYA NEO FOUNDERS",
            "AYANEO FOUNDER",
            "AYA NEO FOUNDER",
        ]:
            self.tdp_notches["tdp_notch0_val"] = 7
            self.tdp_notches["tdp_notch1_val"] = 10
            self.tdp_notches["tdp_notch2_val"] = 13
            self.tdp_notches["tdp_notch3_val"] = 16
            self.tdp_notches["tdp_notch4_val"] = 19
            self.tdp_notches["tdp_notch5_val"] = 22
            self.tdp_notches["tdp_notch6_val"] = 25

        # 2021 Pro MAX TDP 30W, increment by 3/4W
        elif self.sys_id in [
            "AYANEO 2021 Pro Retro Power",
            "AYA NEO 2021 Pro Retro Power",
            "AYANEO 2021 Pro",
            "AYA NEO 2021 Pro",
        ]:
            self.tdp_notches["tdp_notch0_val"] = 7
            self.tdp_notches["tdp_notch1_val"] = 10
            self.tdp_notches["tdp_notch2_val"] = 14
            self.tdp_notches["tdp_notch3_val"] = 18
            self.tdp_notches["tdp_notch4_val"] = 22
            self.tdp_notches["tdp_notch5_val"] = 26
            self.tdp_notches["tdp_notch6_val"] = 30

        # NEXT max TDP 32W, increment by 6/4W
        elif self.sys_id in [
            "NEXT",
            "AYANEO NEXT",
            "AYA NEO NEXT",
            "NEXT Pro",
            "AYANEO NEXT Pro",
            "AYA NEO NEXT Pro",
        ]:
            self.tdp_notches["tdp_notch0_val"] = 7
            self.tdp_notches["tdp_notch1_val"] = 10
            self.tdp_notches["tdp_notch2_val"] = 14
            self.tdp_notches["tdp_notch3_val"] = 18
            self.tdp_notches["tdp_notch4_val"] = 22
            self.tdp_notches["tdp_notch5_val"] = 28
            self.tdp_notches["tdp_notch6_val"] = 32

        return self.tdp_notches

    async def set_gpu_prop(self, value: int, prop: str) -> bool:
        write_gpu_prop(prop, value)
        self.modified_settings = True
        return True

    async def get_gpu_prop(self, prop: str) -> int:
        return read_gpu_prop(prop)

    async def get_gpuclk_toggle(self) -> bool:
        logging.info(f"Use GPUCLK is set to {self.use_gpuclk}")
        return self.use_gpuclk

    async def set_gpuclk_toggle(self, enabled: bool):
        logging.info(f"Use GPUCLK is now: {enabled}")
        self.use_gpuclk = enabled
        self.save_settings(self)

    # Label Stuff
    async def get_version(self) -> str:
        return VERSION

    async def get_sys_id(self) -> str:
        if not self.sys_id:
            self.sys_id = read_sys_id()
        return self.sys_id

    # Battery stuff
    async def get_charge_now(self) -> int:
        return int(
            read_from_sys(
                "/sys/class/hwmon/hwmon2/device/energy_now", amount=-1
            ).strip()
        )

    async def get_charge_full(self) -> int:
        return int(
            read_from_sys(
                "/sys/class/hwmon/hwmon2/device/energy_full", amount=-1
            ).strip()
        )

    async def get_power_draw(self) -> int:
        pd_in_uw = int(
            read_from_sys(
                "/sys/class/power_supply/BAT0/power_now", amount=-1
            ).strip()
        )

        logging.info(pd_in_uw)
        return pd_in_uw

    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):

        # startup: load & apply settings
        if os.path.exists(SETTINGS_LOCATION):
            settings = read_json(SETTINGS_LOCATION)
            logging.info(f"Loaded settings from {SETTINGS_LOCATION}: {settings}")
        else:
            settings = None
            logging.info(f"Settings {SETTINGS_LOCATION} does not exist, skipped")

        if settings is None or settings["persistent"] == False:
            logging.info("Ignoring settings from file")
            self.persistent = False

        else:
            # apply settings
            self.persistent = True
            logging.info(f"Restoring settings from file: {settings}")

            # GPU
            write_gpu_prop("a", settings["gpu"]["stapm"])
            write_gpu_prop("b", settings["gpu"]["slowppt"])
            write_gpu_prop("c", settings["gpu"]["fastppt"])
            self.tdp_delta = settings["gpu"]["tdp_delta"]

    # Called from main_view::onViewReady
    async def on_ready(self):
        delta = time.time() - startup_time
        logging.info(f"Front-end initialised {delta}s after startup")

    # Persistence stuff
    async def get_persistent(self) -> bool:
        logging.info(f"persistent is set to {self.persistent}")
        return self.persistent

    async def set_persistent(self, enabled: bool):
        logging.info(f"Persistence is now: {enabled}")
        self.persistent = enabled
        self.save_settings(self)

    def current_settings(self) -> dict:
        settings = dict()
        settings["gpu"] = self.current_gpu_settings(self)
        settings["persistent"] = self.persistent
        return settings

    def current_gpu_settings(self) -> dict:
        settings = dict()
        settings["stapm"] = read_gpu_prop("0x0000")
        settings["slowppt"] = read_gpu_prop("0x0010")
        settings["fastppt"] = read_gpu_prop("0x0008")
        settings["tdp_delta"] = self.tdp_delta
        return settings

    def save_settings(self):
        settings = self.current_settings(self)
        logging.info(f"Saving settings to file: {settings}")
        if not os.path.exists(SETTINGS_LOCATION):
            settings_file = Path(SETTINGS_LOCATION)
            settings_file.touch()

        write_json(SETTINGS_LOCATION, settings)


# Gets the current setting for the property requested
def read_gpu_prop(prop: str) -> int:
    val = 0
    args = (
        "sudo " + HOME_DIR + "/homebrew/plugins/Aya-Neo-Power-Tools/bin/ryzenadj --dump-table"
    )
    ryzenadj = Popen(args, shell=True, stdout=PIPE, stderr=STDOUT)
    output = ryzenadj.stdout.read()
    all_props = output.split(b"\n")

    for prop_row in all_props:
        current_row = str(prop_row)
        if prop in current_row:
            row_list = current_row.split("|")
            val = int(float(row_list[3].strip()))
            break
    return val

# Gets the value for the property requested
def write_gpu_prop(prop: str, value: int):

    # Protect against exploits from JS at runtime.
    if type(value) != int:
        raise TypeError("TypeError. value is of type " + type(value) + ", not 'int'")
        return

    # Prevent setting spam that can cause instability.
    current_val = read_gpu_prop(gpu_prop_dict[prop])
    if current_val == value:
        logger.debug("Value already set for property. Ignoring.")
        return

    value *= 1000
    args = (
        "sudo "
        + HOME_DIR
        + "/bin/ryzenadj -"
        + prop
        + " "
        + str(value)
    )
    ryzenadj = Popen(args, shell=True, stdout=PIPE, stderr=STDOUT)
    output = ryzenadj.stdout.read()
    logger.info(output)


def write_to_sys(path, value: int):
    with open(path, mode="w") as f:
        f.write(str(value))
    logging.info(f"Wrote `{value}` to {path}")


def read_from_sys(path, amount=1):
    with open(path, mode="r") as f:
        value = f.read(amount)
        logging.info(f"Read `{value}` from {path}")
        return value


def read_sys_id() -> str:
    return open("/sys/devices/virtual/dmi/id/product_name", "r").read().strip()


def read_sys_int(path) -> int:
    return int(read_from_sys(path, amount=-1).strip())


def write_json(path, data):
    with open(path, mode="w") as f:
        json.dump(data, f)  # I always guess which is which param and I hate it


def read_json(path):
    with open(path, mode="r") as f:
        return json.load(f)


os_release = read_from_sys("/etc/os-release", amount=-1).strip()
logging.info(f"/etc/os-release\n{os_release}")
