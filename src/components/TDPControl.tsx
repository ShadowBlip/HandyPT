import { Component, createRef, RefObject } from 'preact';
import { SMM } from '../types/SMM';
import { PowerTools } from '../util';
import { ValueSlider } from '../deck-components/Slider.tsx';

export interface TDPControlProperties {
  smm: SMM;
  pt: PowerTools;
}

export class TDPControl extends Component<TDPControlProperties> {
  currentBoost: number = 0;
  currentTDP: number = 0;
  defaultTDP: number = 0;
  minTDP: number = 0;
  maxTDP: number = 0;
  minBoost: number = 0;
  maxBoost: number = 0;

  // RefObjects
  tdpSlider: RefObject<HTMLDivElement> = createRef();
  boostSlider: RefObject<HTMLDivElement> = createRef();

  async componentDidMount() {
    // Get and set our range values
    const tdpRange = await this.props.pt.getTDPRange();

    this.maxTDP = tdpRange!.tdp_max_val;
    this.minTDP = tdpRange!.tdp_min_val;
    this.defaultTDP = tdpRange!.tdp_default_val;
    this.maxBoost = tdpRange!.tdp_max_boost;
    this.minBoost = 0;

    // Get our current TDP and set to default or persisted value.
    this.currentTDP = await this.props.pt.readGPUProp('a');
    if (this.currentTDP != this.defaultTDP) {
      this.currentTDP = this.defaultTDP;
      await this.setTDP();
    }

    // Make sure our sliders match
    this.tdpSlider!.current.setSliderParams(
      this.minTDP,
      this.maxTDP,
      this.currentTDP
    );
    this.boostSlider!.current.setSliderParams(
      this.minBoost,
      this.maxBoost,
      this.currentBoost
    );
  }

  async onChangeTDP(e: Event, value: number) {
    this.currentTDP = value;
    await this.setTDP();
  }

  async onChangeBoost(e: Event, value: number) {
    this.currentBoost = value;
    await this.setTDP();
  }
  // Set the TDP to the given value
  async setTDP() {
    // set the correct TDP value
    let fast_ppt = this.currentTDP + this.currentBoost;
    let slow_ppt = this.currentTDP + Math.ceil(this.currentBoost / 2);

    await this.props.pt.setGPUProp('a', this.currentTDP);
    await this.props.pt.setGPUProp('b', fast_ppt);
    await this.props.pt.setGPUProp('c', slow_ppt);
  }

  // VIEW SECTION
  // renders the GUI
  render(properties: TDPControlProperties) {
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
            onChange={(e: Event, value: number) => this.onChangeTDP(e, value)}
            name="TDP"
            description={this.currentTDP}
            minVal={this.minTDP}
            maxVal={this.maxTDP}
          />
          <ValueSlider
            ref={this.boostSlider}
            onChange={(e: Event, value: number) => this.onChangeBoost(e, value)}
            name="TDP Boost Limit"
            description={this.currentBoost}
            minVal={this.minBoost}
            maxVal={this.maxBoost}
          />
        </div>
      </div>
    );
  }
}
