import { Component, ComponentChildren, createRef } from 'preact';
import { SMM } from './types/SMM';
import { PowerTools } from './util';
import { Battery } from './components/Battery';
import { SystemLabel } from './components/SystemLabel';
import {TDPControl} from './components/TDPControl';

// Properties we can pass to the application.
export interface AppProps {
  smm: SMM;
  pt: PowerTools;
  children?: ComponentChildren;
}

export class App extends Component<AppProps> {
  system_label = createRef();
  constructor(props: AppProps) {
    super(props);
  }

  componentDidMount() {
    if (this.system_label.current) {
      this.system_label.current.innerText = this.props.pt.getVersion();
    }
  }

  render(props: AppProps, state: any) {
    return (
      <body style="/*margin:0px;padding:0px;*/ overflow-x: hidden; margin: 0px">
        <div
          class="quickaccesscontrols_PanelSection_2C0g0"
          style="padding: 0px 4px; margin-bottom: 0px"
        >
          <div class="quickaccesscontrols_PanelSectionTitle_2iFf9"></div>
          <div class="quickaccesscontrols_PanelSectionTitle_2iFf9">
            <div class="gamepaddialog_FieldLabel_3b0U-"></div>
          </div>
        </div>
        <SystemLabel smm={props.smm} pt={props.pt} />
        <div class="Panel Focusable" tabIndex={0}>
          <Battery smm={props.smm} pt={props.pt} />
        </div>
	<TDPControl smm={props.smm} pt={props.pt} />
        <div
          class="quickaccesscontrols_PanelSection_2C0g0"
          style="padding: 0px 4px"
        >
          <div class="quickaccesscontrols_PanelSectionRow_2VQ88">
            <div
              class="gamepaddialog_Field_S-_La gamepaddialog_WithFirstRow_qFXi6 gamepaddialog_VerticalAlignCenter_3XNvA gamepaddialog_WithDescription_3bMIS gamepaddialog_ExtraPaddingOnChildrenBelow_5UO-_ gamepaddialog_StandardPadding_XRBFu gamepaddialog_HighlightOnFocus_wE4V6 Panel Focusable"
              style="--indent-level: 0"
            >
              <div class="gamepaddialog_FieldLabelRow_H9WOq">
                <div class="gamepaddialog_FieldLabel_3b0U-">
                  Persist Changes
                </div>
                <div class="gamepaddialog_FieldChildren_14_HB">
                  <div
                    id="persistToggle"
                    tabIndex={0}
                    class="gamepaddialog_Toggle_24G4g Focusable"
                  >
                    <div class="gamepaddialog_ToggleRail_2JtC3"></div>
                    <div class="gamepaddialog_ToggleSwitch_3__OD"></div>
                  </div>
                </div>
              </div>
              <div class="gamepaddialog_FieldDescription_2OJfk">
                Restores settings after a reboot
              </div>
            </div>
          </div>
        </div>
        <div
          class="quickaccesscontrols_PanelSection_2C0g0"
          style="padding: 0px 4px"
        >
          <div class="quickaccesscontrols_PanelSectionRow_2VQ88">
            <div
              class="gamepaddialog_Field_S-_La gamepaddialog_WithFirstRow_qFXi6 gamepaddialog_VerticalAlignCenter_3XNvA gamepaddialog_InlineWrapShiftsChildrenBelow_pHUb6 gamepaddialog_WithBottomSeparator_1lUZx gamepaddialog_StandardPadding_XRBFu gamepaddialog_HighlightOnFocus_wE4V6 Panel Focusable"
              style="--indent-level: 0"
            >
              <div class="gamepaddialog_FieldLabelRow_H9WOq">
                <div class="gamepaddialog_FieldLabel_3b0U-">
                  Aya Neo Power Tools
                </div>
                <div class="gamepaddialog_FieldChildren_14_HB">
                  <div
                    class="gamepaddialog_LabelFieldValue_5Mylh"
                    id="versionStr"
                  >
                    v0.0.0
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    );
  }
}
