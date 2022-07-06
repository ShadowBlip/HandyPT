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

  // gets the current power by device
  async getPower(device: string): Promise<number> {
    try {
      const output = await this.props.smm.FS.readFile(
        `/sys/class/power_supply/BAT0/${device}`
      );
      return parseInt(output.trim());
    } catch (err) {
      console.log(`Error fetching charge: ${err}`);
      return 0;
    }
  }

  // update will be called every second, refreshing the battery capacity and
  // power draw.
  async update() {
    //console.log('Updating battery stats');
    const batCapacityNow: HTMLDivElement = this.capacityRef.current;
    const batPowerDraw: HTMLDivElement = this.powerDrawRef.current;
    const chargeNow = await this.getPower('energy_now');
    const chargeFull = await this.getPower('energy_full');
    const powerDraw = await this.getPower('power_now');
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
      <div class="quickaccesscontrols_PanelSectionRow_2VQ88">
        <div
          class="gamepaddialog_Field_S-_La gamepaddialog_WithFirstRow_qFXi6 gamepaddialog_VerticalAlignCenter_3XNvA gamepaddialog_InlineWrapShiftsChildrenBelow_pHUb6 gamepaddialog_WithBottomSeparator_1lUZx gamepaddialog_StandardPadding_XRBFu gamepaddialog_HighlightOnFocus_wE4V6 Panel Focusable"
          style="--indent-level: 0"
        >
          <div class="gamepaddialog_FieldLabelRow_H9WOq">
            <div class="gamepaddialog_FieldLabel_3b0U-">System Charge</div>
            <div class="gamepaddialog_FieldChildren_14_HB">
              <div
                class="gamepaddialog_LabelFieldValue_5Mylh"
                id="batCapacityNow"
                ref={this.capacityRef}
              ></div>
            </div>
          </div>
        </div>
        <div
          class="gamepaddialog_Field_S-_La gamepaddialog_WithFirstRow_qFXi6 gamepaddialog_VerticalAlignCenter_3XNvA gamepaddialog_InlineWrapShiftsChildrenBelow_pHUb6 gamepaddialog_WithBottomSeparator_1lUZx gamepaddialog_StandardPadding_XRBFu gamepaddialog_HighlightOnFocus_wE4V6 Panel Focusable"
          style="--indent-level: 0"
        >
          <div class="gamepaddialog_FieldLabelRow_H9WOq">
            <div class="gamepaddialog_FieldLabel_3b0U-">Battery Power Draw</div>
            <div class="gamepaddialog_FieldChildren_14_HB">
              <div
                class="gamepaddialog_LabelFieldValue_5Mylh"
                id="batPowerDraw"
                ref={this.powerDrawRef}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
