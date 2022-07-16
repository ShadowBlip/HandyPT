import { Component, createRef } from 'preact';
import { SMM } from '../types/SMM';
import { PowerTools } from '../util';

export interface SystemLabelProps {
  smm: SMM;
  pt: PowerTools;
}

export class SystemLabel extends Component<SystemLabelProps> {
  cpuID = createRef();
  sysID = createRef();
  versionID = createRef();

  async componentDidMount() {
    if (this.cpuID.current) {
      this.cpuID.current.innerText = await this.props.pt.getCPUID();
    }

    if (this.sysID.current) {
      this.sysID.current.innerText = await this.props.pt.getSysID();
    }

    if (this.versionID.current) {
      this.versionID.current.innerText = await this.props.pt.getVersion();
    }
  }

  render(props: SystemLabelProps) {
    return (
      <div
        class="quickaccesscontrols_PanelSectionRow_2VQ88"
        style="padding: 0px 4px"
      >
        <div class="gamepaddialog_Field_S-_La gamepaddialog_WithFirstRow_qFXi6 gamepaddialog_WithChildrenBelow_1u5FT gamepaddialog_VerticalAlignCenter_3XNvA gamepaddialog_InlineWrapShiftsChildrenBelow_pHUb6 gamepaddialog_ChildrenWidthFixed_1ugIU gamepaddialog_ExtraPaddingOnChildrenBelow_5UO-_ gamepaddialog_StandardPadding_XRBFu gamepaddialog_HighlightOnFocus_wE4V6 Panel Focusable ">
          <div class="quickaccesscontrols_PanelSectionTitle_2iFf9">
            <div class="quickaccesscontrols_Text_1hJkB">System Info</div>
          </div>
          <div class="quickaccesscontrols_PanelSectionRow_2VQ88">
            <div
              class="gamepaddialog_Field_S-_La gamepaddialog_WithFirstRow_qFXi6 gamepaddialog_VerticalAlignCenter_3XNvA gamepaddialog_InlineWrapShiftsChildrenBelow_pHUb6 gamepaddialog_WithBottomSeparator_1lUZx gamepaddialog_StandardPadding_XRBFu gamepaddialog_HighlightOnFocus_wE4V6 Panel Focusable"
              style="--indent-level: 0"
            >
              <div class="gamepaddialog_FieldLabelRow_H9WOq">
                <div class="gamepaddialog_FieldLabel_3b0U-">
                  <div
                    class="quickaccesscontrols_Text_1hJkB"
                    ref={this.sysID}
                  />
                </div>
              </div>
              <div
                class="gamepaddialog_FieldDescription_2OJfk"
                ref={this.cpuID}
              />
            </div>
            <div
              class="gamepaddialog_Field_S-_La gamepaddialog_WithFirstRow_qFXi6 gamepaddialog_VerticalAlignCenter_3XNvA gamepaddialog_InlineWrapShiftsChildrenBelow_pHUb6 gamepaddialog_WithBottomSeparator_1lUZx gamepaddialog_StandardPadding_XRBFu gamepaddialog_HighlightOnFocus_wE4V6 Panel Focusable"
              style="--indent-level: 0"
            >
              <div class="gamepaddialog_FieldLabelRow_H9WOq">
                <div class="gamepaddialog_FieldLabel_3b0U-">HandyPT</div>
                <div
                  class="gamepaddialog_LabelFieldValue_5Mylh"
                  ref={this.versionID}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
