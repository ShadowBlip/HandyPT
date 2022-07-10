import { Component, createRef, RefObject } from 'preact';
import { Toggle } from '../deck-components/Toggle.tsx';
import { SMM } from '../types/SMM';
import { PowerTools } from '../util';

export interface CPUControlProps {
  smm: SMM;
  pt: PowerTools;
}
export class CPUControl extends Component<CPUControlProps> {
  smt: RefObject = createRef();

  async toggleSMT(e: Event, toggleState: boolean) {
    console.log(this.props)
    const nextSetting = toggleState ? 'on' : 'off';
    console.log('nextSetting', nextSetting);
    await this.props.pt.setSMT(nextSetting);
  }

  render(props: CPUControlProps) {
    return (
      <div
        class="quickaccesscontrols_PanelSection_2C0g0"
        style="padding: 0px 4px"
      >
        <div class="quickaccesscontrols_PanelSectionRow_2VQ88">
          <div
            class="gamepaddialog_Field_S-_La gamepaddialog_WithFirstRow_qFXi6 gamepaddialog_VerticalAlignCenter_3XNvA gamepaddialog_InlineWrapShiftsChildrenBelow_pHUb6 gamepaddialog_WithBottomSeparator_1lUZx gamepaddialog_StandardPadding_XRBFu gamepaddialog_HighlightOnFocus_wE4V6 Panel Focusable"
            style="--indent-level: 0"
          >
            <Toggle
              ref={this.smt}
              enabled={true}
              onClick={(e, toggleState) => this.toggleSMT(e, toggleState)}
              name="Toggle SMT"
              description="Toggles Similtanious Multithreading"
            />
          </div>
        </div>
      </div>
    );
  }
}
