import { Component, ComponentChildren, createRef } from 'preact';
import { AppProps } from '../view';
export interface LabelProperties {
  children?: ComponentChildren;
}

// Battery shit
export class Battery extends Component<AppProps> {
  timer: number = 0;
  capacityRef = createRef();
  powerDrawRef = createRef();

  // update will be called every second, refreshing the battery capacity and
  // power draw.
  async update() {
    //console.log('Updating battery stats');
    const batCapacityNow: HTMLDivElement = this.capacityRef.current;
    const batPowerDraw: HTMLDivElement = this.powerDrawRef.current;
    const chargeNow = await this.props.pt.getPower('energy_now');
    const chargeFull = await this.props.pt.getPower('energy_full');
    const powerDraw = await this.props.pt.getPower('power_now');
    batCapacityNow.innerText =
      ((7.7 * chargeNow) / 1000000).toFixed(2).toString() +
      ' Wh (' +
      ((100 * chargeNow) / chargeFull).toFixed(0).toString() +
      '%)';
    batPowerDraw.innerText = (powerDraw / 1000000).toString() + 'W';
  }

  // Runs when this component is loaded
  async componentDidMount() {
    if (this.powerDrawRef.current) {
      // update the battery info every second
      this.timer = setInterval(async () => {
        await this.update();
      }, 5000); //msec
    }
  }

  // Runs when this component is unloaded
  async componentWillUnmount() {
    clearInterval(this.timer);
  }

  render(props: AppProps) {
    return (
      <div
        class="quickaccesscontrols_PanelSectionRow_2VQ88"
        style="padding: 0px 4px"
      >
        <div class="gamepaddialog_Field_S-_La gamepaddialog_WithFirstRow_qFXi6 gamepaddialog_WithChildrenBelow_1u5FT gamepaddialog_VerticalAlignCenter_3XNvA gamepaddialog_InlineWrapShiftsChildrenBelow_pHUb6 gamepaddialog_ChildrenWidthFixed_1ugIU gamepaddialog_ExtraPaddingOnChildrenBelow_5UO-_ gamepaddialog_StandardPadding_XRBFu gamepaddialog_HighlightOnFocus_wE4V6 Panel Focusable ">
          <div class="quickaccesscontrols_PanelSectionTitle_2iFf9">
            <div class="quickaccesscontrols_Text_1hJkB">Battery</div>
          </div>
          <div class="quickaccesscontrols_PanelSectionRow_2VQ88">
            <div
              class="gamepaddialog_Field_S-_La gamepaddialog_WithFirstRow_qFXi6 gamepaddialog_VerticalAlignCenter_3XNvA gamepaddialog_InlineWrapShiftsChildrenBelow_pHUb6 gamepaddialog_WithBottomSeparator_1lUZx gamepaddialog_StandardPadding_XRBFu gamepaddialog_HighlightOnFocus_wE4V6 Panel Focusable"
              style="--indent-level: 0"
            >
              <div class="gamepaddialog_FieldLabelRow_H9WOq">
                <div class="gamepaddialog_FieldLabel_3b0U-">Charge</div>
                <div
                  class="gamepaddialog_LabelFieldValue_5Mylh"
                  ref={this.capacityRef}
                />
              </div>
            </div>
            <div
              class="gamepaddialog_Field_S-_La gamepaddialog_WithFirstRow_qFXi6 gamepaddialog_VerticalAlignCenter_3XNvA gamepaddialog_InlineWrapShiftsChildrenBelow_pHUb6 gamepaddialog_WithBottomSeparator_1lUZx gamepaddialog_StandardPadding_XRBFu gamepaddialog_HighlightOnFocus_wE4V6 Panel Focusable"
              style="--indent-level: 0"
            >
              <div class="gamepaddialog_FieldLabelRow_H9WOq">
                <div class="gamepaddialog_FieldLabel_3b0U-">Power Draw</div>
                <div
                  class="gamepaddialog_LabelFieldValue_5Mylh"
                  ref={this.powerDrawRef}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
