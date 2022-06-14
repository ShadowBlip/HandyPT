import { FunctionComponent } from 'preact';
import { SMM } from './types/SMM';

const TDP_DELTA_NOTCHES = 4;
const VERSION = '0.0.1';
const TDP_NOTCHES = 7;
const TOGGLE_ON_CLASS = 'gamepaddialog_On_3ld7T';

type GPUProps = {
  [a: string]: string;
  b: string;
  c: string;
};

const gpu_prop_dict: GPUProps = {
  a: '0x0000', // STAPM LIMIT
  b: '0x0008', // FAST PPT
  c: '0x0010', // SLOW PPT
};

interface GPUNotches {
  gpuclk_notch0_val?: number;
  gpuclk_notch1_val?: number;
  gpuclk_notch2_val?: number;
  gpuclk_notch3_val?: number;
  gpuclk_notch4_val?: number;
  gpuclk_notch5_val?: number;
  gpuclk_notch6_val?: number;
}

export class PowerTools {
  // Crankshaft Mod Manager
  smm: SMM;

  // Backend properties
  gpuclk_notches: GPUNotches = {};
  modified_settings = false;
  persistent = false;
  sys_id = '';
  tdp_delta = 2;
  tdp_notches = {};
  use_gpuclk = false;

  // From front-end
  currentTDPNotch = 0;
  gpuClkEnabled = false;
  tdpDeltaSliderVal = 0;
  tdpSliderVal = 0;

  constructor(smm: SMM) {
    this.smm = smm;
  }

  async getHomeDir(): Promise<string> {
    const out = await this.smm.Exec.run('bash', ['-c', 'echo $HOME']);
    return out.stdout;
  }

  async getRyzenadj(): Promise<string> {
    const homeDir = await this.getHomeDir();
    return `${homeDir}/.var/app/space.crankshaft.Crankshaft/data/crankshaft/plugins/Aya-Neo-Power-Tools/bin/ryzenadj`;
  }

  // Returns the version strings
  getVersion(): string {
    return VERSION;
  }

  onViewReady() {
    console.log('Front-end initialised');
  }

  async readSysID(): Promise<string> {
    return await this.smm.FS.readFile(
      '/sys/devices/virtual/dmi/id/product_name'
    );
  }

  async getGPUClkNotches(): Promise<GPUNotches> {
    if (this.sys_id === '') {
      this.sys_id = await this.readSysID();
    }

    // Founders & 2021 MAX GPU CLK 1500, increment by 200Mhz
    const incr200Mhz = [
      'AYANEO 2021',
      'AYA NEO 2021',
      'AYANEO FOUNDERS',
      'AYA NEO FOUNDERS',
      'AYANEO FOUNDER',
      'AYA NEO FOUNDER',
    ];
    if (incr200Mhz.includes(this.sys_id)) {
      this.gpuclk_notches.gpuclk_notch0_val = 200;
      this.gpuclk_notches.gpuclk_notch1_val = 400;
      this.gpuclk_notches.gpuclk_notch2_val = 600;
      this.gpuclk_notches.gpuclk_notch3_val = 800;
      this.gpuclk_notches.gpuclk_notch4_val = 1000;
      this.gpuclk_notches.gpuclk_notch5_val = 1200;
      this.gpuclk_notches.gpuclk_notch6_val = 1500;
    }

    // 2021 PRO MAX GPU CLK 1750, increment by 250Mhz
    const incr250Mhz = [
      'AYANEO 2021 Pro Retro Power',
      'AYA NEO 2021 Pro Retro Power',
      'AYANEO 2021 Pro',
      'AYA NEO 2021 Pro',
    ];
    if (incr250Mhz.includes(this.sys_id)) {
      this.gpuclk_notches.gpuclk_notch0_val = 250;
      this.gpuclk_notches.gpuclk_notch1_val = 500;
      this.gpuclk_notches.gpuclk_notch2_val = 750;
      this.gpuclk_notches.gpuclk_notch3_val = 1000;
      this.gpuclk_notches.gpuclk_notch4_val = 1250;
      this.gpuclk_notches.gpuclk_notch5_val = 1500;
      this.gpuclk_notches.gpuclk_notch6_val = 1750;
    }
    // NEXT MAX GPU CLK 2000, increment by 300Mhz
    const incr300Mhz = [
      'NEXT',
      'AYANEO NEXT',
      'AYA NEO NEXT',
      'NEXT Pro',
      'AYANEO NEXT Pro',
      'AYA NEO NEXT Pro',
    ];
    if (incr300Mhz.includes(this.sys_id)) {
      this.gpuclk_notches.gpuclk_notch0_val = 250;
      this.gpuclk_notches.gpuclk_notch1_val = 500;
      this.gpuclk_notches.gpuclk_notch2_val = 750;
      this.gpuclk_notches.gpuclk_notch3_val = 1000;
      this.gpuclk_notches.gpuclk_notch4_val = 1250;
      this.gpuclk_notches.gpuclk_notch5_val = 1500;
      this.gpuclk_notches.gpuclk_notch6_val = 1750;
    }

    return this.gpuclk_notches;
  }

  // Set the given GPU property.
  async setGPUProp(value: number, prop: string): Promise<boolean> {
    await this.writeGPUProp(prop, value);
    this.modified_settings = true;
    return true;
  }

  // Read a specific GPU property.
  async readGPUProp(prop: string): Promise<number> {
    const ryzenadj = await this.getRyzenadj();
    const args = `sudo ${ryzenadj} --dump-table`;

    const cmd = await this.smm.Exec.run('bash', ['-c', args]);
    const output = cmd.stdout;
    const all_props = output.split('\n');

    const prop_row = all_props.find((prop_row) => {
      if (!prop_row.includes(prop)) {
        return false;
      }
      return true;
    });
    const row_list = prop_row?.split('|');
    const val = row_list![3].trim();

    return parseInt(val);
  }

  // Gets the value for the property requested
  async writeGPUProp(prop: string, value: number) {
    // Prevent setting spam that can cause instability.
    let current_val = await this.readGPUProp(gpu_prop_dict[prop]);
    if (current_val === value) {
      console.log('Value already set for property. Ignoring.');
      return;
    }

    value *= 1000;
    const ryzenadj = await this.getRyzenadj();
    const args = `sudo ${ryzenadj} -${prop} ${value.toString()}`;
    const cmd = await this.smm.Exec.run('bash', ['-c', args]);
    const output = cmd.stdout;
    console.log(output);
  }
}

function getGPUProp(prop) {
  return call_plugin_method('get_gpu_prop', { prop: prop });
}

function getChargeNow() {
  return call_plugin_method('get_charge_now', {});
}

function getChargeFull() {
  return call_plugin_method('get_charge_full', {});
}

function getPowerDraw() {
  return call_plugin_method('get_power_draw', {});
}

function setPersistent(value) {
  return call_plugin_method('set_persistent', { enabled: value });
}

function getPersistent() {
  return call_plugin_method('get_persistent', {});
}

function getTDPNotches() {
  return call_plugin_method('get_tdp_notches', {});
}

function getTDPDelta() {
  return call_plugin_method('get_tdp_delta', {});
}

function setTDPDelta(new_delta) {
  return call_plugin_method('set_tdp_delta', { new_delta: new_delta });
}

function getSysID() {
  return call_plugin_method('get_sys_id', {});
}

// other logic

async function onReady() {
  await onViewReady();
  await onReadyGPU();
  await updateVersion();
  await updateBatteryStats();
  setToggleState(
    document.getElementById('persistToggle'),
    await getPersistent()
  );
  // setToggleState(
  //   document.getElementById("GPUCLKToggle"),
  //   await getGPUClkTGL()
  //);
  window.setInterval(function () {
    updateBatteryStats().then((_) => {});
  }, 5000);
  let tdpNotch = document.getElementById('TDPNotch');
  tdpNotch.onmousemove = (e) => updateTDPNotch(e, tdpNotch);
  let tdpDeltaNotch = document.getElementById('TDPDeltaNotch');
  tdpDeltaNotch.onmousemove = (e) => updateTDPDeltaNotch(e, tdpDeltaNotch);
  // let gpuClkNotch = document.getElementById("GPUCLKNotch");
  // gpuClkNotch.onmousemove = (e) => updateGPUClkNotch(e, gpuClkNotch);
}

function setToggleState(toggle, state) {
  if (state && !toggle.classList.contains(TOGGLE_ON_CLASS)) {
    toggle.classList.add(TOGGLE_ON_CLASS);
  }

  if (!state && toggle.classList.contains(TOGGLE_ON_CLASS)) {
    toggle.classList.remove(TOGGLE_ON_CLASS);
  }
}

function getToggleState(toggle) {
  return toggle.classList.contains(TOGGLE_ON_CLASS);
}

async function updateBatteryStats() {
  // console.log("Updating battery stats")\
  let batCapacityNow = document.getElementById('batCapacityNow');
  let batPowerDraw = document.getElementById('batPowerDraw');
  let sysIDLab = document.getElementById('sysID_Lab');
  let chargeNow = await getChargeNow();
  let chargeFull = await getChargeFull();
  let powerDraw = await getPowerDraw();
  let sysID = await getSysID();
  batCapacityNow.innerText =
    ((7.7 * chargeNow) / 1000000).toFixed(2).toString() +
    ' Wh (' +
    ((100 * chargeNow) / chargeFull).toFixed(0).toString() +
    '%)';
  batPowerDraw.innerText = (powerDraw / 1000000).toString() + 'W';
  sysIDLab.innerText = sysID.toString();
}

async function onReadyGPU() {
  // Get TDP values for this model and set the slider label values.
  let tdp_notches = await getTDPNotches();
  let TDPNotch0Lab = document.getElementById('TDPNotch0_Lab');
  TDPNotch0Lab.innerText = tdp_notches['tdp_notch0_val'].toString();
  let TDPNotch1Lab = document.getElementById('TDPNotch1_Lab');
  TDPNotch1Lab.innerText = tdp_notches['tdp_notch1_val'].toString();
  let TDPNotch2Lab = document.getElementById('TDPNotch2_Lab');
  TDPNotch2Lab.innerText = tdp_notches['tdp_notch2_val'].toString();
  let TDPNotch3Lab = document.getElementById('TDPNotch3_Lab');
  TDPNotch3Lab.innerText = tdp_notches['tdp_notch3_val'].toString();
  let TDPNotch4Lab = document.getElementById('TDPNotch4_Lab');
  TDPNotch4Lab.innerText = tdp_notches['tdp_notch4_val'].toString();
  let TDPNotch5Lab = document.getElementById('TDPNotch5_Lab');
  TDPNotch5Lab.innerText = tdp_notches['tdp_notch5_val'].toString();
  let TDPNotch6Lab = document.getElementById('TDPNotch6_Lab');
  TDPNotch6Lab.innerText = tdp_notches['tdp_notch6_val'].toString();

  let current_tdp = await getGPUProp('0x0000');
  let tdp_set = Object.keys(tdp_notches).find(
    (key) => tdp_notches[key] === current_tdp
  );
  if (tdp_set == 'tdp_notch0_val') {
    selectNotch('TDPNotch', 0, 7);
    currentTDPNotch = 0;
  } else if (tdp_set == 'tdp_notch1_val') {
    selectNotch('TDPNotch', 1, 7);
    currentTDPNotch = 1;
  } else if (tdp_set == 'tdp_notch2_val') {
    selectNotch('TDPNotch', 2, 7);
    currentTDPNotch = 2;
  } else if (tdp_set == 'tdp_notch3_val') {
    selectNotch('TDPNotch', 3, 7);
    currentTDPNotch = 3;
  } else if (tdp_set == 'tdp_notch4_val') {
    selectNotch('TDPNotch', 4, 7);
    currentTDPNotch = 4;
  } else if (tdp_set == 'tdp_notch5_val') {
    selectNotch('TDPNotch', 5, 7);
    currentTDPNotch = 5;
  } else if (tdp_set == 'tdp_notch6_val') {
    selectNotch('TDPNotch', 6, 7);
    currentTDPNotch = 6;
  } else {
    selectNotch('TDPNotch', 3, 7);
    currentTDPNotch = 3;
  }

  let tdp_delta = await getTDPDelta();
  selectNotch('TDPDeltaNotch', tdp_delta - 2, 4);

  // let gpuclk_notches = await getGPUClkNotches();
  // let gpuClkNotch0Lab = document.getElementById("GPUCLKNotch0_Lab");
  // gpuClkNotch0Lab.innerText = gpuclk_notches["gpuclk_notch0_val"].toString();
  // let gpuClkNotch1Lab = document.getElementById("GPUCLKNotch1_Lab");
  // gpuClkNotch1Lab.innerText = gpuclk_notches["gpuclk_notch1_val"].toString();
  // let gpuClkNotch2Lab = document.getElementById("GPUCLKNotch2_Lab");
  // gpuClkNotch2Lab.innerText = gpuclk_notches["gpuclk_notch2_val"].toString();
  // let gpuClkNotch3Lab = document.getElementById("GPUCLKNotch3_Lab");
  // gpuClkNotch3Lab.innerText = gpuclk_notches["gpuclk_notch3_val"].toString();
  // let gpuClkNotch4Lab = document.getElementById("GPUCLKNotch4_Lab");
  // gpuClkNotch4Lab.innerText = gpuclk_notches["gpuclk_notch4_val"].toString();
  // let gpuClkNotch5Lab = document.getElementById("GPUCLKNotch5_Lab");
  // gpuClkNotch5Lab.innerText = gpuclk_notches["gpuclk_notch5_val"].toString();
  // let gpuClkNotch6Lab = document.getElementById("GPUCLKNotch6_Lab");
  // gpuClkNotch6Lab.innerText = gpuclk_notches["gpuclk_notch6_val"].toString();
}

async function updateTDPNotch(e, tdpNotch) {
  let closestNotch = getClosestNotch(e, tdpNotch, TDP_NOTCHES);
  onSetTDPNotch(closestNotch);
}

async function updateTDPDeltaNotch(e, tdpDeltaNotch) {
  let closestNotch = getClosestNotch(e, tdpDeltaNotch, TDP_DELTA_NOTCHES);
  await setTDPDelta(closestNotch + 2);
  selectNotch('TDPDeltaNotch', closestNotch, TDP_DELTA_NOTCHES);
  onSetTDPNotch(currentTDPNotch);
}

async function onSetTDPNotch(index) {
  currentTDPNotch = index;
  let tdp_notches = await getTDPNotches();
  const ROOT_ID = 'TDPNotch';
  selectNotch(ROOT_ID, index, 7);
  let tdpNotch = document.getElementById(ROOT_ID);
  let tdp_delta = await getTDPDelta();
  if (index == 0) {
    await setGPUProp(tdp_notches['tdp_notch0_val'], 'a');
    await setGPUProp(tdp_notches['tdp_notch0_val'], 'c');
    await setGPUProp(tdp_notches['tdp_notch0_val'] + tdp_delta, 'b');
  } else if (index == 1) {
    await setGPUProp(tdp_notches['tdp_notch1_val'], 'a');
    await setGPUProp(tdp_notches['tdp_notch1_val'], 'c');
    await setGPUProp(tdp_notches['tdp_notch1_val'] + tdp_delta, 'b');
  } else if (index == 2) {
    await setGPUProp(tdp_notches['tdp_notch2_val'], 'a');
    await setGPUProp(tdp_notches['tdp_notch2_val'], 'c');
    await setGPUProp(tdp_notches['tdp_notch2_val'] + tdp_delta, 'b');
  } else if (index == 3) {
    await setGPUProp(tdp_notches['tdp_notch3_val'], 'a');
    await setGPUProp(tdp_notches['tdp_notch3_val'], 'c');
    await setGPUProp(tdp_notches['tdp_notch3_val'] + tdp_delta, 'b');
  } else if (index == 4) {
    await setGPUProp(tdp_notches['tdp_notch4_val'], 'a');
    await setGPUProp(tdp_notches['tdp_notch4_val'], 'c');
    await setGPUProp(tdp_notches['tdp_notch4_val'] + tdp_delta, 'b');
  } else if (index == 5) {
    await setGPUProp(tdp_notches['tdp_notch5_val'], 'a');
    await setGPUProp(tdp_notches['tdp_notch4_val'], 'c');
    await setGPUProp(tdp_notches['tdp_notch5_val'] + tdp_delta, 'b');
  } else if (index == 6) {
    await setGPUProp(tdp_notches['tdp_notch6_val'], 'a');
    await setGPUProp(tdp_notches['tdp_notch6_val'], 'c');
    await setGPUProp(tdp_notches['tdp_notch6_val'] + tdp_delta, 'b');
  }
}

function getClosestNotch(e, root, elements) {
  sliderVal = e.x / root.scrollWidth;
  let closestNotch = Math.round(sliderVal * elements - 1);
  if (closestNotch >= elements) {
    closestNotch = elements - 1;
  } else if (closestNotch < 0) {
    closestNotch = 0;
  }
  return closestNotch;
}

function selectNotch(rootId, index, elements) {
  const ENABLED_CLASS = 'gamepadslider_TickActive_1gnUV';
  let root = document.getElementById(rootId);
  root.style =
    '--normalized-slider-value:' + (index / (elements - 1)).toString() + ';';
  for (let i = 0; i < elements; i++) {
    let notch = document.getElementById(rootId + i);
    if (notch.classList.contains(ENABLED_CLASS) && i > index) {
      notch.classList.remove(ENABLED_CLASS);
    } else if (!notch.classList.contains(ENABLED_CLASS) && i <= index) {
      notch.classList.add(ENABLED_CLASS);
    }
  }
}

async function togglePersist() {
  let toggle = document.getElementById('persistToggle');
  let isActive = getToggleState(toggle);
  await setPersistent(!isActive);
  setToggleState(toggle, !isActive);
}

async function updateVersion() {
  let version = await getVersion();
  let target = document.getElementById('versionStr');
  target.innerText = 'v' + version;
}
