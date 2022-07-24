import { SMM } from './types/SMM';

const VERSION = '0.2.0-dev';

let battery_path = '';

type GPUProps = {
  a: string;
  b: string;
  c: string;
};

const AMD_prop_dict: GPUProps = {
  a: '0x0000', // STAPM LIMIT
  b: '0x0008', // FAST PPT
  c: '0x0010', // SLOW PPT
};

const Intel_prop_dict: GPUProps = {
  a: 'constraint_0_power_limit_uw', //long_term
  b: 'constraint_1_power_limit_uw', //peak_power
  c: 'constraint_2_power_limit_uw', //short_term
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

  constructor(smm: SMM) {
    this.smm = smm;
  }

  // gets the current power by device
  async getPower(device: string): Promise<number> {
    try {
      const output = await this.smm.FS.readFile(
        `/sys/class/power_supply/BAT0/${device}`
      );
      return parseInt(output.trim());
    } catch (err) {
      console.log(`Error fetching charge: ${err}`);
      return 0;
    }
  }

  // Gets the system id
  async getSysID(): Promise<string> {
    const id = await this.smm.FS.readFile(
      '/sys/devices/virtual/dmi/id/product_name'
    );
    return id.trim();
  }

  async getTDPRange(): Promise<TDPRange> {
    const cpuid = await this.getCPUID();
    switch (cpuid) {
      // 4500U/5800U max TDP 25w
      case 'AMD Ryzen 5 4500U with Radeon Graphics':
      case 'AMD Ryzen 7 5700U with Radeon Graphics': {
        this.tdp_range.tdp_min_val = 5;
        this.tdp_range.tdp_max_val = 25;
        this.tdp_range.tdp_default_val = 15;
        break;
      }
      // 4800U max TDP 30w
      case 'AMD Ryzen 7 5800U with Radeon Graphics':
      case 'AMD Ryzen 7 4800U with Radeon Graphics': {
        this.tdp_range.tdp_min_val = 5;
        this.tdp_range.tdp_max_val = 30;
        this.tdp_range.tdp_default_val = 15;
        break;
      }
      // 5825U max TDP 32w
      case 'AMD Ryzen 7 5825U with Radeon Graphics': {
        this.tdp_range.tdp_min_val = 5;
        this.tdp_range.tdp_max_val = 32;
        this.tdp_range.tdp_default_val = 15;
        break;
      }
    }
    return this.tdp_range;
  }

  async getCPUVendor(): Promise<string> {
    const cpuid = await this.smm.Exec.run('bash', [
      '-c',
      'lscpu | grep "Vendor ID" | cut -d : -f 2 | xargs',
    ]);
    return cpuid.stdout;
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

  async setGPUProp(prop: string, value: number): Promise<boolean> {
    let cpuVendor: string = await this.getCPUVendor();
    switch (cpuVendor) {
      case 'AuthenticAMD':
      case 'AuthenticAMD Advanced Micro Devices, Inc.':
        return await this.setAMDProp(prop, value);
      case 'GenuineIntel':
        return await this.setIntelProp(prop, value);
    }
    return false;
  }

  async readGPUProp(prop: string): Promise<number> {
    let cpuVendor: string = await this.getCPUVendor();
    switch (cpuVendor) {
      case 'AuthenticAMD':
      case 'AuthenticAMD Advanced Micro Devices, Inc.':
        return await this.readAMDProp(prop);
      case 'GenuineIntel':
	let result = await this.readIntelProp(prop);
      	return result/1000000;
    }
    return 0;
  }

  // Set the given AMD property.
  async setAMDProp(prop: string, value: number): Promise<boolean> {
    let result = await this.writeAMDProp(prop, value);
    this.modified_settings = true;
    return result;
  }

  // Read a specific AMD property.
  async readAMDProp(prop: string): Promise<number> {
    // Run command to parse current propery values
    const property = AMD_prop_dict[prop]
    const ryzenadj = await this.getRyzenadj();
    const args = `sudo ${ryzenadj} --dump-table`;
    const cmd = await this.smm.Exec.run('bash', ['-c', args]);
    const output = cmd.stdout;

    // Find the property we care about
    const all_props = output.split('\n');
    const prop_row = all_props.find((prop_row) => {
      if (!prop_row.includes(property)) {
        return false;
      }
      return true;
    });
    const row_list = prop_row?.split('|');
    const val = row_list![3].trim();
    return parseInt(val);
  }

  // Gets the value for the property requested
  async writeAMDProp(prop: string, value: number): Promise<boolean> {
    // Prevent spaming parameter setting, can cause instability.
    let current_val = await this.readAMDProp(prop);
    if (current_val === value) {
      // console.log('Value already set for property. Ignoring.');
      return true;
    }

    value *= 1000;
    const ryzenadj = await this.getRyzenadj();
    const args = `sudo ${ryzenadj} -${prop} ${value.toString()}`;
    const cmd = await this.smm.Exec.run('bash', ['-c', args]);
    const output = cmd.stdout;
    const err = cmd.stderr;
    console.log(output, err);
    if (err) {
      return false;
    } else {
      return true;
    }
  }

  async setIntelProp(prop: string, value: number): Promise<boolean> {
    let result = await this.writeIntelProp(prop, value);
    this.modified_settings = result;
    return result;
  }
  async writeIntelProp(prop: string, value: number): Promise<boolean> {
    // Prevent spaming parameter setting, can cause instability.
    let current_val = await this.readIntelProp(prop);
    if (current_val === value * 1000000) {
      return false;
    }
    const homeDir = await this.getHomeDir();
    const command = Intel_prop_dict[prop];
    const args = `sudo ${homeDir}/.var/app/space.crankshaft.Crankshaft/data/crankshaft/plugins/HandyPT/bin/powertools.sh ${command} ${value}`;
    const cmd = await this.smm.Exec.run('bash', ['-c', args]);
    const output = cmd.stdout;
    const err = cmd.stderr;
    console.log(output, err);
    if (err) {
      return false;
    } else {
      return true;
    }
  }

  async readIntelProp(prop: string): Promise<number> {
    const command = Intel_prop_dict[prop];
    const args = `cat /sys/class/powercap/intel-rapl/intel-rapl:0/${command}`;
    const value = await this.smm.Exec.run('bash', ['-c', args]);
    return parseInt(value.stdout);
  }

  // Sets CPU Boost on or off
  async setBoost(value: String) {
    const homeDir = await this.getHomeDir();
    const command = value === 'on' ? 'cpuBoostOn' : 'cpuBoostOff';
    const args = `sudo ${homeDir}/.var/app/space.crankshaft.Crankshaft/data/crankshaft/plugins/HandyPT/bin/powertools.sh ${command}`;
    const cmd = await this.smm.Exec.run('bash', ['-c', args]);
    const output = cmd.stdout;
    const err = cmd.stderr;
    console.log(output, err);
  }

  // Sets SMT on or off
  async setSMT(value: String) {
    const homeDir = await this.getHomeDir();
    const command = value === 'on' ? 'smtOn' : 'smtOff';
    const args = `sudo ${homeDir}/.var/app/space.crankshaft.Crankshaft/data/crankshaft/plugins/HandyPT/bin/powertools.sh ${command}`;
    const cmd = await this.smm.Exec.run('bash', ['-c', args]);
    const output = cmd.stdout;
    const err = cmd.stderr;
    console.log(output, err);
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
