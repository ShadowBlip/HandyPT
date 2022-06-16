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

interface TDPNotches {
  tdp_notch0_val?: number;
  tdp_notch1_val?: number;
  tdp_notch2_val?: number;
  tdp_notch3_val?: number;
  tdp_notch4_val?: number;
  tdp_notch5_val?: number;
  tdp_notch6_val?: number;
}

export class PowerTools {
  // Crankshaft Mod Manager
  smm: SMM;

  // Backend properties
  gpu_model: string = '';
  modified_settings: boolean = false;
  persistent: boolean = false;
  sys_id: string = '';
  tdp_delta: number = 0;
  tdp_notches: TDPNotches = {};

  // From front-end
  currentTDPNotch: number = 0;
  tdpDeltaSliderVal: number = 0;
  tdpSliderVal: number = 0;

  constructor(smm: SMM) {
    this.smm = smm;
  }

  async get_tdp_notches(): Promise<TDPNotches> {
    const cpuid = await this.getCPUID();
    switch (cpuid) {
      // 4500U max TDP 25w, increment by 3W
      case 'AMD Ryzen 7 4500U with Radeon Graphics': {
        this.tdp_notches.tdp_notch0_val = 7;
        this.tdp_notches.tdp_notch1_val = 10;
        this.tdp_notches.tdp_notch2_val = 13;
        this.tdp_notches.tdp_notch3_val = 16;
        this.tdp_notches.tdp_notch4_val = 19;
        this.tdp_notches.tdp_notch5_val = 22;
        this.tdp_notches.tdp_notch6_val = 25;
        break;
      }
      // 4800U Mmax TDP 30w, increment by 3/4W
      case 'AMD Ryzen 7 4800U with Radeon Graphics': {
        this.tdp_notches.tdp_notch0_val = 7;
        this.tdp_notches.tdp_notch1_val = 10;
        this.tdp_notches.tdp_notch2_val = 14;
        this.tdp_notches.tdp_notch3_val = 18;
        this.tdp_notches.tdp_notch4_val = 22;
        this.tdp_notches.tdp_notch5_val = 26;
        this.tdp_notches.tdp_notch6_val = 30;
        break;
      }
      // 5825U max TDP 32W, increment by 6/4W
      case 'AMD Ryzen 7 5825U with Radeon Graphics': {
        this.tdp_notches.tdp_notch0_val = 7;
        this.tdp_notches.tdp_notch1_val = 10;
        this.tdp_notches.tdp_notch2_val = 14;
        this.tdp_notches.tdp_notch3_val = 18;
        this.tdp_notches.tdp_notch4_val = 22;
        this.tdp_notches.tdp_notch5_val = 28;
        this.tdp_notches.tdp_notch6_val = 32;
        break;
      }
    }
    return this.tdp_notches;
  }

  async getCPUID(): Promise<string> {
    const cpuid = await this.smm.Exec.run('bash', [
      '-c',
      'lscpu | grep "Model name" | cut -d : -f 2 | xargs',
    ]);
    return cpuid.stdout;
  }

  async getHomeDir(): Promise<string> {
    const out = await this.smm.Exec.run('bash', ['-c', 'echo $HOME']);
    return out.stdout;
  }

  async getRyzenadj(): Promise<string> {
    const homeDir = await this.getHomeDir();
    return `${homeDir}/.var/app/space.crankshaft.Crankshaft/data/crankshaft/plugins/HandyPT/bin/ryzenadj`;
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
