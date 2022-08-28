import { Component, createRef, RefObject } from 'preact';
import { SMM } from '../types/SMM';
import { PowerTools } from '../util';
import { ValueSlider } from '../deck-components/Slider';

export interface TDPControlProperties {
  smm: SMM;
  pt: PowerTools;
}

export interface TDPControlState {
  boostCurrent: number;
  boostMax: number;
  boostMin: number;
  boostSteps: number;
  tdpCurrent: number;
  tdpDefault: number;
  tdpMax: number;
  tdpMin: number;
  tdpSteps: number;
}

export class TDPControl extends Component<
  TDPControlProperties,
  TDPControlState
> {
  // RefObjects
  tdpSlider: RefObject<HTMLDivElement> = createRef();
  boostSlider: RefObject<HTMLDivElement> = createRef();

  async componentDidMount() {
    // Get and set our range values
    const tdpRange = await this.props.pt.getTDPRange();

    this.setState({
      tdpMax: tdpRange!.tdp_max_val!,
      tdpMin: tdpRange!.tdp_min_val!,
      tdpDefault: tdpRange!.tdp_default_val!,
      tdpSteps: tdpRange!.tdp_max_val! - tdpRange!.tdp_min_val! + 1,
      tdpCurrent: tdpRange!.tdp_default_val!,
      boostMax: tdpRange!.tdp_max_boost!,
      boostMin: 0,
      boostCurrent: 0,
      boostSteps: tdpRange!.tdp_max_boost! + 1,
    });
  }

  async componentDidUpdate() {
    // Get our current TDP and set to default or persisted value.
    await this.setTDP();
  }

  async onChangeTDP(value: number) {
    this.setState({ tdpCurrent: value });
  }

  async onChangeBoost(value: number) {
    this.setState({ boostCurrent: value });
  }
  // Set the TDP to the given value
  async setTDP() {
    if (!this.state.tdpCurrent) {
      return;
    }

    // set the correct TDP value
    let fast_ppt = this.state.tdpCurrent + this.state.boostCurrent;
    let slow_ppt =
      this.state.tdpCurrent + Math.ceil(this.state.boostCurrent / 2);

    await this.props.pt.setGPUProp('a', this.state.tdpCurrent);
    await this.props.pt.setGPUProp('b', fast_ppt);
    await this.props.pt.setGPUProp('c', slow_ppt);
  }

  // VIEW SECTION
  // renders the GUI
  render(_properties: TDPControlProperties, state: TDPControlState) {
    return (
      <div
        class="quickaccesscontrols_PanelSectionRow_2VQ88"
        style="padding: 0px 4px"
      >
        <div class="gamepaddialog_Field_S-_La gamepaddialog_WithFirstRow_qFXi6 gamepaddialog_WithChildrenBelow_1u5FT gamepaddialog_VerticalAlignCenter_3XNvA gamepaddialog_InlineWrapShiftsChildrenBelow_pHUb6 gamepaddialog_ChildrenWidthFixed_1ugIU gamepaddialog_ExtraPaddingOnChildrenBelow_5UO-_ gamepaddialog_StandardPadding_XRBFu gamepaddialog_HighlightOnFocus_wE4V6 Panel Focusable ">
          <div class="quickaccesscontrols_PanelSectionTitle_2iFf9">
            <div class="quickaccesscontrols_Text_1hJkB">TDP Settings</div>
          </div>
          <ValueSlider
            ref={this.tdpSlider}
            onChange={(value: number) => this.onChangeTDP(value)}
            name="TDP"
            minVal={state.tdpMin}
            maxVal={state.tdpMax}
            defaultVal={state.tdpDefault}
            steps={state.tdpSteps}
            gamepadGroup="handy"
            gamepadItem="handy-tdp-slider"
          />
          <ValueSlider
            ref={this.boostSlider}
            onChange={(value: number) => this.onChangeBoost(value)}
            name="TDP Boost Limit"
            minVal={state.boostMin}
            maxVal={state.boostMax}
            defaultVal={0}
	    steps={state.boostSteps}
            gamepadGroup="handy"
            gamepadItem="handy-boost-slider"
          />
        </div>
      </div>
    );
  }
}
