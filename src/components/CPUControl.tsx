import { Component, createRef, RefObject } from 'preact';
import { Toggle } from '../deck-components/Toggle.tsx';
import { Slider } from '../deck-components/Slider.tsx';
import { SMM } from '../types/SMM';
import { PowerTools } from '../util';

export interface CPUControlProps {
  smm: SMM;
  pt: PowerTools;
}
export class CPUControl extends Component<CPUControlProps> {
  smt: RefObject<HTMLDivElement> = createRef();
  cpuFreq: RefObject<HTMLDivElement> = createRef();

  async toggleSMT(e: Event, toggleState: boolean) {
    console.log(this.props);
    const nextSetting = toggleState ? 'on' : 'off';
    console.log('nextSetting', nextSetting);
    await this.props.pt.setSMT(nextSetting);
  }

  async onChangeCPU(e: Event, value: number) {
    console.log('In CPU', e, value);
  }

  render(props: CPUControlProps) {
    return (
      <div
        class="quickaccesscontrols_PanelSection_2C0g0"
        style="padding: 0px 4px"
      >
        <div class="gamepaddialog_Field_S-_La gamepaddialog_WithFirstRow_qFXi6 gamepaddialog_WithChildrenBelow_1u5FT gamepaddialog_VerticalAlignCenter_3XNvA gamepaddialog_InlineWrapShiftsChildrenBelow_pHUb6 gamepaddialog_ChildrenWidthFixed_1ugIU gamepaddialog_ExtraPaddingOnChildrenBelow_5UO-_ gamepaddialog_StandardPadding_XRBFu gamepaddialog_HighlightOnFocus_wE4V6 Panel Focusable ">
          <div class="quickaccesscontrols_PanelSectionTitle_2iFf9">
            <div class="quickaccesscontrols_Text_1hJkB">CPU Settings</div>
          </div>
          <Toggle
            ref={this.smt}
            enabled={true}
            onClick={(e: Event, toggleState: boolean) =>
              this.toggleSMT(e, toggleState)
            }
            name="Toggle SMT"
            description="Toggles Similtanious Multithreading"
          />
          <Slider
            ref={this.cpuFreq}
            onChange={(e: Event, value: number) => this.onChangeCPU(e, value)}
            name="CPU Frequency"
            description="0"
            minVal={0}
            maxVal={10}
          />
        </div>
      </div>
    );
  }
}
