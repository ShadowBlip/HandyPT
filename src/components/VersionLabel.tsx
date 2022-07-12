import { Component, createRef } from 'preact';
import { AppProps } from '../view';

export class VersionLabel extends Component<AppProps> {
  ref = createRef();
  constructor(props: AppProps) {
    super(props);
  }

  async componentDidMount() {
    if (this.ref.current) {
      const label: HTMLDivElement = this.ref.current;
      label.innerText = await this.props.pt?.getVersion();
    }
  }

  render(props: AppProps) {
    return (
      <div
        class="quickaccesscontrols_PanelSectionRow_2VQ88"
        style="padding: 0px 4px"
      >
        <div class="quickaccesscontrols_PanelSectionRow_2VQ88">
          <div
            class="gamepaddialog_Field_S-_La gamepaddialog_WithFirstRow_qFXi6 gamepaddialog_VerticalAlignCenter_3XNvA gamepaddialog_InlineWrapShiftsChildrenBelow_pHUb6 gamepaddialog_WithBottomSeparator_1lUZx gamepaddialog_StandardPadding_XRBFu gamepaddialog_HighlightOnFocus_wE4V6 Panel Focusable"
            style="--indent-level: 0"
          >
            <div class="gamepaddialog_FieldLabelRow_H9WOq">
              <div class="gamepaddialog_FieldLabel_3b0U-">HandyPT</div>
              <div class="gamepaddialog_FieldChildren_14_HB">
                <div
                  id="versionLabel"
                  class="quickaccesscontrols_Text_1hJkB"
                  ref={this.ref}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
