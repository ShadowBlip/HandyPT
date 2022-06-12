# HandyPT

This is a [Crankshaft](https://crankshaft.space/) plugin provides control over various power settings such as TDP in handheld devices. We utilize the [RyzenAdj](https://github.com/FlyGoat/RyzenAdj) utility to interface with the hardware. 

## What does it do?

- Set GPU power parameters (TDP, Boost TDP)
- Display supplementary battery and system power use info.
- Keep settings between restarts (stored in `~/.config/powertools.json`)
- More to come!

## Which devices does this support?

We currently support the following devices:
- Aya Neo FE through NEXT
- OneXPlayer AMD

While any APU can theoretcally be utilized, the safe operating limits need to be defined before support can be included. If you dont see you device listed head over to our [issues page]() to request support

## License

This is licensed under GNU GPLv3.

## Disclaimer

No guarentee is given by the author that this tool will not damage your device, and your voluntary use of this tool forgoes any liability for damage that may come from this tool, irrespective of its intended use. Use at your own risk.
This tool is not officially licensed by or directly associated with AYA NEO, OneXPlayer, or any of their employees.

