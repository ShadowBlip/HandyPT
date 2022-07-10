# HandyPT

This is a [Crankshaft](https://crankshaft.space/) plugin that provides control over various power settings such as TDP in handheld devices in Linux. We utilize the [RyzenAdj](https://github.com/FlyGoat/RyzenAdj) utility to interface with the hardware. 

## What does it do?

- Set GPU power parameters (TDP, Boost TDP)
- Display supplementary battery and system power use info.
- More to come! Follow us for new features and improvements.

## What does it look like?

Click this video:

[![Handheld PowerTools - OneXPlayer mini AMD](https://img.youtube.com/vi/Q2JoKCXB8aM/0.jpg)](https://www.youtube.com/watch?v=Q2JoKCXB8aM)

## Which devices does this support?

We currently support devices with the following APU's:
- 4500U, 4800U, 5700U, 5800U, and 5825U

While any APU can theoretcally be utilized, the safe operating limits need to be defined before support can be included. If you dont see you device listed head over to our [issues page](https://github.com/ShadowBlip/HandyPT/issues) to request support.


## What distributions of Linus are supported?

We test each release on ChimeraOS and HoloISO. Any distro that supports flatpak, gamescope, and wayland should be able to use this with the DeckUI. Head over to the [issues page](https://github.com/ShadowBlip/HandyPT/issues) if your distro has issues and we'll work to get more broad support.

## Installing

This should work on both ChimeraOS and HoloISO. There are two install methods, both require a little bit of command line.
  
  ### Prerequisites: 
  
  1. Install crankshaft: https://crankshaft.space/
    - enable -cef-enable-debugging in the steam developer settings.
  ```
  flatpak install -y flathub space.crankshaft.Crankshaft
  flatpak run space.crankshaft.Crankshaft
  ```
  
  2. HoloISO users will need to install glibc: `sudo pacman -Sy glibc`
  3. For manual installs you will need the wget package: `sudo pacman -Sy wget`
  
  ### Crankshaft Plugin store (Preferred)
  Open the home menu and navigate down to `Get Plugins`, then click `Install` on the `Handheld Power Tools` entry.
  Once installed, open a TTY via SSH or `ctrl+alt+f2` and run `sudo sh ~/.var/app/space.crankshaft.Crankshaft/data/crankshaft/plugins/HandyPT/configure.sh`
  reboot
  
  ### Manual install
  - open a TTY via SSH or `ctrl+alt+f2`
  - run the following commands:
  ```
  cd ~/.var/app/space.crankshaft.Crankshaft/data/crankshaft/plugins/
  wget https://github.com/ShadowBlip/HandyPT/files/9075194/handy_pt-v0.1.1.tar.gz
  tar -xzf handy_pt-v0.1.1.tar.gz
  sudo HandyPT/configure.sh
  ```
  Edit `~/.var/app/space.crankshaft.Crankshaft/data/crankshaft/config.toml` and add the following:
  ```
  [plugins]
    [plugins.HandyPT]
      enabled = true
  ```
  *NOTE* If you have other plugins installed already, be sure to only have one [plugins] line. Each successive plugin follows the same pattern below that header.
  
  - reload crankshaft or reboot
  
  [handy_pt-v0.1.1.tar.gz](https://github.com/ShadowBlip/HandyPT/files/9075194/handy_pt-v0.1.1.tar.gz)
  sha256: `f1a3fdc171539a44700d42d68c1703b198edaf3b2d3667e7402a7a5ac717e70e`

## License

This is licensed under GNU GPLv3.

## Disclaimer

No guarentee is given by the author that this tool will not damage your device, and your voluntary use of this tool forgoes any liability for damage that may come from this tool, irrespective of its intended use. Use at your own risk.
This tool is not officially licensed by or directly associated with AYA NEO, OneXPlayer, or any of their employees.

## I Like what you are doing, do you have a patreon?

I do. If you like what we have produced here and would like to provide support, you can find me [here](https://www.patreon.com/user?u=75781137)
