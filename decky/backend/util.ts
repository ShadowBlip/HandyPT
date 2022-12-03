import { SMM } from './types/SMM';

const VERSION = '0.3.0';

let battery_path = '';

type GPUProps = {
  a: string;
  b: string;
  c: string;
};

type GPUCurrent = {
  a: number;
  b: number;
  c: number;
};

const AMD_prop_dict: GPUProps = {
  a: '0x0000', // STAPM LIMIT
  b: '0x0008', // FAST PPT
  c: '0x0010', // SLOW PPT
};

const Intel_prop_dict: GPUProps = {
  a: 'constraint_0_power_limit_uw', // long_term
  b: 'constraint_1_power_limit_uw', // peak_power
  c: 'constraint_2_power_limit_uw', // short_term
};

interface TDPRange {
  tdp_min_val?: number;
  tdp_max_val?: number;
  tdp_default_val?: number;
  tdp_max_boost?: number;
  set?: boolean;
}

export class PowerTools {
  // Crankshaft Mod Manager
  smm: SMM;

  // Backend properties
  cpu_id: string = '';
  cpu_vendor: string = '';
  current_tdp: GPUCurrent = {
    a: 0,
    b: 0,
    c: 0,
  };
  gpu_model: string = '';
  modified_settings: boolean = false;
  persistent: boolean = false;
  powertools: string = window.csPluginsDir + '/HandyPT/bin/powertools.sh';
  ryzenadj: string = window.csPluginsDir + '/HandyPT/bin/ryzenadj';
  sys_id: string = '';
  tdp_range: TDPRange = { set: false };

  constructor(smm: SMM) {
    this.smm = smm;
  }

  // Returns the specified battery power value (capacity/charge/power draw)
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

  // Returns TDP Range for a given CPU/APU/iGPU
  async getTDPRange(): Promise<TDPRange> {
    if (this.tdp_range.set === false) {
      const cpuid = await this.getCPUID();
      const id = await this.getSysID();
      switch (cpuid) {
        case 'AMD Athlon Silver 3020e with Radeon Graphics':
        case 'AMD Athlon Silver 3050e with Radeon Graphics': {
          this.tdp_range.tdp_min_val = 2;
          this.tdp_range.tdp_max_val = 12;
          this.tdp_range.tdp_default_val = 9;
          this.tdp_range.tdp_max_boost = 6;
          break;
        }
        case 'AMD Ryzen 5 5560U with Radeon Graphics': {
          if (id == 'AIR Pro') {
            this.tdp_range.tdp_max_val = 18;
          } else {
            this.tdp_range.tdp_max_val = 15;
	  }
          this.tdp_range.tdp_default_val = 9;
          this.tdp_range.tdp_max_boost = 2;
          this.tdp_range.tdp_min_val = 2;
          break;
        }
        case 'AMD Ryzen 5 4500U with Radeon Graphics':
        case 'AMD Ryzen 7 5700U with Radeon Graphics':
        case '11th Gen Intel(R) Core(TM) i5-1135G7 @ 2.40GHz':
        case '11th Gen Intel(R) Core(TM) i7-1165G7 @ 2.80GHz':
        case '11th Gen Intel(R) Core(TM) i7-1195G7 @ 2.90GHz': {
          this.tdp_range.tdp_default_val = 14;
          this.tdp_range.tdp_max_boost = 2;
          this.tdp_range.tdp_max_val = 28;
          this.tdp_range.tdp_min_val = 4;
          break;
        }
        case 'AMD Ryzen 7 4800U with Radeon Graphics': {
          this.tdp_range.tdp_default_val = 16;
          this.tdp_range.tdp_max_boost = 5;
          this.tdp_range.tdp_max_val = 30;
          this.tdp_range.tdp_min_val = 4;
          break;
        }
        case 'AMD Ryzen 7 5800U with Radeon Graphics':
        case 'AMD Ryzen 7 5825U with Radeon Graphics':
        case 'AMD Ryzen 5 6600U with Radeon Graphics': {
          if (id == 'AIR Pro') {
            this.tdp_range.tdp_default_val = 9;
            this.tdp_range.tdp_max_boost = 2;
            this.tdp_range.tdp_max_val = 18;
            this.tdp_range.tdp_min_val = 2;
          } else {
            this.tdp_range.tdp_default_val = 16;
            this.tdp_range.tdp_max_boost = 5;
            this.tdp_range.tdp_max_val = 33;
            this.tdp_range.tdp_min_val = 4;
	  }
          break;
        }
        case 'AMD Ryzen 7 6800U with Radeon Graphics': {
          this.tdp_range.tdp_default_val = 16;
          this.tdp_range.tdp_max_boost = 4;
          this.tdp_range.tdp_max_val = 38;
          this.tdp_range.tdp_min_val = 4;
          break;
	}
        case 'AMD Ryzen 9 6900HS with Radeon Graphics': {
          this.tdp_range.tdp_default_val = 35;
          this.tdp_range.tdp_max_boost = 4;
          this.tdp_range.tdp_max_val = 50;
          this.tdp_range.tdp_min_val = 4;
          break;
	}
      }
    }
    return this.tdp_range;
  }

  // Returns the DMI Product Name
  async getSysID(): Promise<string> {
    if (this.sys_id == '') {
      const id = await this.smm.FS.readFile(
        '/sys/devices/virtual/dmi/id/product_name'
      );
      this.sys_id = id.trim();
    }
    return this.sys_id;
  }

  // Returns the CPU Vendor
  async getCPUVendor(): Promise<string> {
    if (this.cpu_vendor === '') {
      const vendorid = await this.smm.Exec.run('bash', [
        '-c',
        'lscpu | grep "Vendor ID" | cut -d : -f 2 | xargs',
      ]);
      this.cpu_vendor = vendorid.stdout;
    }
    return this.cpu_vendor;
  }

  // Returns the CPU Model
  async getCPUID(): Promise<string> {
    if (this.cpu_id === '') {
      const cpuid = await this.smm.Exec.run('bash', [
        '-c',
        'lscpu | grep "Model name" | cut -d : -f 2 | xargs',
      ]);
      this.cpu_id = cpuid.stdout;
    }
    return this.cpu_id;
  }

  // Returns the version strings
  getVersion(): string {
    return VERSION;
  }

  // Sets the given GPU property to the given value
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

  // Returns the current value if the given property
  // NOTE: currently bypassed while ryzenadj is updated.
  // Will need to introduce again to verify continuously that nothing else
  // overwrote us, or at least reflect and changes from BIOS or software we
  // didn't do ourselves.
  async readGPUProp(prop: string): Promise<number> {
    let cpuVendor: string = await this.getCPUVendor();
    switch (cpuVendor) {
      case 'AuthenticAMD':
      case 'AuthenticAMD Advanced Micro Devices, Inc.':
        return await this.readAMDProp(prop);
      case 'GenuineIntel':
        let result = await this.readIntelProp(prop);
        return result / 1000000;
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
    const property = AMD_prop_dict[prop];
    const args = `sudo ${this.ryzenadj} --dump-table`;
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
    if (this.current_tdp[prop] === value) {
      return true;
    }

    const args = `sudo ${this.ryzenadj} -${prop} ${(value * 1000).toString()}`;
    const cmd = await this.smm.Exec.run('bash', ['-c', args]);
    const output = cmd.stdout;
    const err = cmd.stderr;
    console.log(output, err);
    if (err) {
      return false;
    } else {
      this.current_tdp[prop] = value
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
    if (this.current_tdp[prop] === value) {
      return false;
    }
    const command = Intel_prop_dict[prop];
    const args = `sudo ${this.powertools} ${command} ${value}`;
    const cmd = await this.smm.Exec.run('bash', ['-c', args]);
    const output = cmd.stdout;
    const err = cmd.stderr;
    console.log(output, err);
    if (err) {
      return false;
    } else {
      this.current_tdp[prop] = value
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
    const command = value === 'on' ? 'cpuBoostOn' : 'cpuBoostOff';
    const args = `sudo ${this.powertools} ${command}`;
    const cmd = await this.smm.Exec.run('bash', ['-c', args]);
    const output = cmd.stdout;
    const err = cmd.stderr;
    console.log(output, err);
  }

  // Sets SMT on or off
  async setSMT(value: String) {
    const command = value === 'on' ? 'smtOn' : 'smtOff';
    const args = `sudo ${this.powertools} ${command}`;
    const cmd = await this.smm.Exec.run('bash', ['-c', args]);
    const output = cmd.stdout;
    const err = cmd.stderr;
    console.log(output, err);
  }
}
