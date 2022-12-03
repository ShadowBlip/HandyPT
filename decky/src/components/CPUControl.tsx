import { Component, createRef, RefObject } from 'preact';
import { Toggle } from '../deck-components/Toggle';
import { SMM } from '../types/SMM';
import { PowerTools } from '../util';

export interface CPUControlProps {
  smm: SMM;
  pt: PowerTools;
}
export class CPUControl extends Component<CPUControlProps> {
  boost: RefObject<HTMLDivElement> = createRef();
  smt: RefObject<HTMLDivElement> = createRef();

  async toggleBoost(e: Event, toggleState: boolean) {
    console.log(this.props);
    const nextSetting = toggleState ? 'on' : 'off';
    console.log('nextSetting', nextSetting);
    await this.props.pt.setBoost(nextSetting);
  }

  async toggleSMT(e: Event, toggleState: boolean) {
    console.log(this.props);
    const nextSetting = toggleState ? 'on' : 'off';
    console.log('nextSetting', nextSetting);
    await this.props.pt.setSMT(nextSetting);
  }

  render(props: CPUControlProps) {
    return (
      <div
        class="quickaccesscontrols_PanelSectionRow_2VQ88"
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
            gamepadGroup="handy"
            gamepadItem="handy-cpu-smt-toggle"
            name="Similtanious Multithreading"
            description="Improves performance in some games. Recommended on for most titles."
          />
          <Toggle
            ref={this.boost}
            enabled={true}
            onClick={(e: Event, toggleState: boolean) =>
              this.toggleBoost(e, toggleState)
            }
            gamepadGroup="handy"
            gamepadItem="handy-cpu-boost-toggle"
            name="CPU Boosting"
            description="Reduces maximum CPU Frequency and power draw. May improve performance in some GPU bound games."
          />
        </div>
      </div>
    );
  }
}
