import { Component, createRef } from 'preact';
import { SMM } from '../types/SMM';
import { PowerTools } from '../util';

export interface SystemLabelProps {
  smm: SMM;
  pt: PowerTools;
}

export class SystemLabel extends Component<SystemLabelProps> {
  sysID = createRef();
  cpuID = createRef();

  async componentDidMount() {
    if (this.sysID.current) {
      this.sysID.current.innerText = await this.props.pt.getSysID();
      this.cpuID.current.innerText = await this.props.pt.getCPUID();
    }
  }

  render(props: SystemLabelProps) {
    return (
      <div
        class="quickaccesscontrols_PanelSectionRow_2VQ88"
        style="padding: 0px 4px"
      >
        <div
          class="gamepaddialog_Field_S-_La gamepaddialog_WithFirstRow_qFXi6 gamepaddialog_VerticalAlignCenter_3XNvA gamepaddialog_InlineWrapShiftsChildrenBelow_pHUb6 gamepaddialog_WithBottomSeparator_1lUZx gamepaddialog_StandardPadding_XRBFu gamepaddialog_HighlightOnFocus_wE4V6 Panel Focusable"
          style="--indent-level: 0"
        >
          <div class="gamepaddialog_FieldLabelRow_H9WOq">
            <div class="gamepaddialog_FieldLabel_3b0U-">
              <div class="gamepadslider_LabelText_1-PvK" ref={this.sysID}></div>
            </div>
          </div>
          <div class="gamepaddialog_FieldDescription_2OJfk" ref={this.cpuID} />
        </div>
      </div>
    );
  }
}
//style="padding: 0px 4px"
