# HandyPT

This is a [Crankshaft](https://crankshaft.space/) plugin that provides control over various power settings such as TDP in handheld devices in Linux. We utilize the [RyzenAdj](https://github.com/FlyGoat/RyzenAdj) utility to interface with the hardware. 

# Developers Note
11/30/2022: Currently HandyPT is not able to be used. The underlying plug-in framkework, Crankshaft, no longer loads into the gamepadui. There is currently no ETA for a fix as the primary developer has not been active since late July. In the meantime, there are a few less ideal solutions to managing TDP on these devices.

- Add RyzenAdj as a non-steam game. Using the launch parameters you can configure the TDP you want to set using the syntax describes in their README.md.
- Add RyzenAdj as a launch parameter for each game with the game specific TDP you desire. 
- For HoloISO users, some people have had success modifying the polkits to intercept the power1_cap setting the steam deck uses and reroute it to RyzenAdj.

I will not be providing support for these methods. Currently I am working on getting these features added to decky-loader. As they won't accept HandyPT as a plugin I am working with the [PowerTools](https://github.com/NGnius/PowerTools) developer to bring this feature set to that plugin, so watch for that development.

## What does it do?

- Set GPU power parameters (TDP, Boost TDP)
- Display supplementary battery and system power use info.
- More to come! Follow us for new features and improvements.

## What does it look like?

Click this video:

[![Handheld PowerTools - OneXPlayer mini AMD](https://img.youtube.com/vi/Q2JoKCXB8aM/0.jpg)](https://www.youtube.com/watch?v=Q2JoKCXB8aM)

## Which devices does this support?

We currently support devices with the following APU's:
- AMD 3020E, 3050E, 4500U, 4800U, 5560U 5700U, 5800U, 5825U, and 6800U
- Intel 1135G7, 1165G7, 1195G7

While any APU can theoretcally be utilized, the safe operating limits need to be defined before support can be included. If you dont see you device listed head over to our [issues page](https://github.com/ShadowBlip/HandyPT/issues) to request support.


## What distributions of Linus are supported?

We test each release on ChimeraOS. Any distro that supports flatpak, gamescope, and wayland should be able to use this with the DeckUI. Head over to the [issues page](https://github.com/ShadowBlip/HandyPT/issues) if your distro has issues and we'll work to get more broad support.

## Installing

There are two install methods, both require a little bit of command line.
  
  ### Prerequisites: 
  
  1. Install crankshaft: https://crankshaft.space/
  ```
  flatpak install -y flathub space.crankshaft.Crankshaft
  flatpak run space.crankshaft.Crankshaft
  ```

  ### Optional prerequisites:
  1. If your distro doesn't shitp GLIBC, you will need to install it: `sudo pacman -Sy glibc`
  2. For manual installs you will need the wget package: `sudo pacman -Sy wget`
  
  ### Crankshaft Plugin store (Preferred)
  - Open the home menu and navigate down to `Get Plugins`, then click `Install` on the `Handheld Power Tools` entry.
  - Once installed, open a TTY via SSH or `ctrl+alt+f2` and run `sudo sh ~/.var/app/space.crankshaft.Crankshaft/data/crankshaft/plugins/HandyPT/bin/configure.sh`
  - Reboot
  
  ### Manual install
  - Read the instructions in the releases page for the specific release you want to install.

## License

This is licensed under GNU GPLv3.

## Disclaimer

No guarentee is given by the author that this tool will not damage your device, and your voluntary use of this tool forgoes any liability for damage that may come from this tool, irrespective of its intended use. Use at your own risk.
This tool is not officially licensed by or directly associated with AYA NEO, OneXPlayer, or any of their employees.

## I Like what you are doing, do you have a patreon?

I do. If you like what we have produced here and would like to provide support, you can find me [here](https://www.patreon.com/user?u=75781137)
