import {FunctionComponent} from 'preact';
import {SMM} from './types/SMM';

const VERSION = '0.1.0-rc3';

let battery_path = '';

type GPUProps = {
  a: string; b : string; c : string;
};

const gpu_prop_dict: GPUProps = {
  a : '0x0000', // STAPM LIMIT
  b : '0x0008', // FAST PPT
  c : '0x0010', // SLOW PPT
};

interface TDPRange {
  tdp_min_val?: number;
  tdp_max_val?: number;
  tdp_default_val?: number;
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
  tdp_range: TDPRange = {};

  constructor(smm: SMM) { this.smm = smm; }

  async getTDPRange(): Promise<TDPRange> {
    const cpuid = await this.getCPUID();
    switch (cpuid) {
    // 4500U/5800U max TDP 25w
    case 'AMD Ryzen 7 4500U with Radeon Graphics':
    case 'AMD Ryzen 7 5800U with Radeon Graphics': {
      this.tdp_range.tdp_min_val = 5;
      this.tdp_range.tdp_max_val = 25;
      this.tdp_range.tdp_default_val = 16;
      break;
    }
    // 4800U max TDP 30w
    case 'AMD Ryzen 7 4800U with Radeon Graphics': {
      this.tdp_range.tdp_min_val = 5;
      this.tdp_range.tdp_max_val = 30;
      this.tdp_range.tdp_default_val = 18;
      break;
    }
    // 5825U max TDP 32w
    case 'AMD Ryzen 7 5825U with Radeon Graphics': {
      this.tdp_range.tdp_min_val = 5;
      this.tdp_range.tdp_max_val = 32;
      this.tdp_range.tdp_default_val = 18;
      break;
    }
    }
    return this.tdp_range;
  }

  async getCPUID(): Promise<string> {
    const cpuid = await this.smm.Exec.run('bash', [
      '-c',
      'lscpu | grep "Model name" | cut -d : -f 2 | xargs',
    ]);
    return cpuid.stdout;
  }

  async getHomeDir(): Promise<string> {
    const out = await this.smm.Exec.run('bash', [ '-c', 'echo $HOME' ]);
    return out.stdout;
  }

  async getRyzenadj(): Promise<string> {
    const homeDir = await this.getHomeDir();
    return `${
        homeDir}/.var/app/space.crankshaft.Crankshaft/data/crankshaft/plugins/HandyPT/bin/ryzenadj`;
  }

  // Returns the version strings
  getVersion(): string { return VERSION; }

  onViewReady() { console.log('Front-end initialised'); }

  async readSysID(): Promise<string> {
    return await this.smm.FS.readFile(
        '/sys/devices/virtual/dmi/id/product_name');
  }

  // Set the given GPU property.
  async setGPUProp(value: number, prop: string): Promise<boolean> {
    await this.writeGPUProp(prop, value);
    this.modified_settings = true;
    return true;
  }

  // Read a specific GPU property.
  async readGPUProp(prop: string): Promise<number> {
    // Run command to parse current propery values
    const ryzenadj = await this.getRyzenadj();
    const args = `sudo ${ryzenadj} --dump-table`;
    const cmd = await this.smm.Exec.run('bash', [ '-c', args ]);
    const output = cmd.stdout;

    // Find the property we care about
    const all_props = output.split('\n');
    const prop_row = all_props.find((prop_row) => {
      if (!prop_row.includes(prop)) {
        return false;
      }
      return true;
    });
    const row_list = prop_row?.split('|');
    // console.log('row_list', row_list)
    const val = row_list![3].trim();
    // console.log("val", val)
    return parseInt(val);
  }

  // Gets the value for the property requested
  async writeGPUProp(prop: string, value: number) {
    // Prevent spaming parameter setting, can cause instability.
    let current_val = await this.readGPUProp(gpu_prop_dict[prop]);
    if (current_val === value) {
      // console.log('Value already set for property. Ignoring.');
      return;
    }

    value *= 1000;
    const ryzenadj = await this.getRyzenadj();
    const args = `sudo ${ryzenadj} -${prop} ${value.toString()}`;
    const cmd = await this.smm.Exec.run('bash', [ '-c', args ]);
    const output = cmd.stdout;
    console.log(output);
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
