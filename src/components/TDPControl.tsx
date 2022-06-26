import { Component, createRef, RefObject } from 'preact';
import { SMM } from '../types/SMM';
import { PowerTools } from '../util';
export interface TDPControlProperties {
  smm?: SMM;
  pt?: PowerTools;
}

export class TDPControl extends Component<TDPControlProperties> {
  default_tdp: number = -1;
  tdp_boost_delta: number = 0;
  root: RefObject<HTMLDivElement> = createRef();

  async componentDidMount() {
    if (this.root.current) {
      // Get and set our notch values
      const tdp_notches = await this.props.pt?.get_tdp_notches();

      // Get our current TDP
      const current_tdp = await this.props.pt?.readGPUProp('0x0000');

      // TODO: this will need to change once persistance is enabled.
      if (current_tdp != tdp_notches!.tdp_notch3_val!) {
        await this.setTDP(tdp_notches!.tdp_notch3_val);
      }
    }
  }

  // Set the TDP to the given value
  async setTDP(tdp_val: number) {
    //set the correct TDP value
    await this.props.pt?.setGPUProp(tdp_val, 'a');
    await this.props.pt?.setGPUProp(tdp_val, 'c');
    await this.props.pt?.setGPUProp(tdp_val + this.tdp_boost_delta, 'b');
  }

  // Set the boost TDP to the given value
  async setBoost(boost_val: number) {
    this.tdp_boost_delta = boost_val;
    const current_tdp = await this.props.pt?.readGPUProp('0x0000');
    await this.setTDP(current_tdp);
  }

  // gets the relative touch percentage from a given touch event.
  async getTouchPercent(e) {
    let target_rect = e.target.getBoundingClientRect();
    let touch_location = e.touches[0].clientX - target_rect.x;
    let touch_raw = touch_location / target_rect.width;
    let touch_percent = Math.min(Math.max(touch_raw, 0), 1);
    return touch_percent;
  }

  // Handle touch events on TDP slider.
  async onSlideTDP(e) {
    let parent = e.srcElement.parentNode;
    let touch_percent = await this.getTouchPercent(e);

    //TODO get min/max of the srcElement
    let tdp_val = Math.ceil(touch_percent * (30 - 7) + 7);
    let style = `--normalized-slider-value: ${touch_percent}`;

    //set params
    parent.setAttribute('style', style);
    await this.setTDP(tdp_val);
  }

  async onSlideBoost(e) {
    let parent = e.srcElement.parentNode;
    let touch_percent = await this.getTouchPercent(e);

    //TODO get min/max of the srcElement
    let boost_val = Math.ceil(touch_percent * (7 - 0) + 0);
    let style = `--normalized-slider-value: ${touch_percent}`;

    //set params
    parent.setAttribute('style', style);
    await this.setBoost(boost_val);
  }

  // Runs when this component is unloaded
  async componentWillUnmount() {}

  // renders the GUI
  render(properties: TDPControlProperties) {
    return (
      <div
        class="quickaccesscontrols_PanelSection_2C0g0"
        style="padding: 0px 4px"
        ref={this.root}
      >
        <div class="gamepaddialog_Field_S-_La gamepaddialog_WithFirstRow_qFXi6 gamepaddialog_WithChildrenBelow_1u5FT gamepaddialog_VerticalAlignCenter_3XNvA gamepaddialog_InlineWrapShiftsChildrenBelow_pHUb6 gamepaddialog_ChildrenWidthFixed_1ugIU gamepaddialog_ExtraPaddingOnChildrenBelow_5UO-_ gamepaddialog_StandardPadding_XRBFu gamepaddialog_HighlightOnFocus_wE4V6 Panel Focusable">
          <div class="quickaccesscontrols_PanelSectionTitle_2iFf9">
            <div class="quickaccesscontrols_Text_1hJkB">TDP Settings</div>
          </div>
          <div class="gamepaddialog_FieldChildren_14_HB">
            <div class="gamepaddialog_FieldDescription_2OJfk">GPU TDP</div>
            <div
              class="gamepadslider_SliderControl_3o137"
              style="--normalized-slider-value: 0.33"
            >
              <div
                class="gamepadslider_SliderTrack_Mq25N gamepadslider_SliderHasNotches_2XiAy"
                ontouchstart={(e) => this.onSlideTDP(e)}
                ontouchmove={(e) => this.onSlideTDP(e)}
              />
              <div class="gamepadslider_SliderHandleContainer_1pQZi">
                <div
                  ref={this.tdpDot}
                  class="gamepadslider_SliderHandle_2yVKj"
                ></div>
              </div>
            </div>
          </div>
          <div class="gamepaddialog_FieldChildren_14_HB">
            <div class="gamepaddialog_FieldDescription_2OJfk">
              GPU TDP Boost Limit
            </div>
            <div class="gamepadslider_SliderControl_3o137">
              <div
                class="gamepadslider_SliderTrack_Mq25N gamepadslider_SliderHasNotches_2XiAy"
                ontouchstart={(e) => this.onSlideBoost(e)}
                ontouchmove={(e) => this.onSlideBoost(e)}
              />
              <div class="gamepadslider_SliderHandleContainer_1pQZi">
                <div
                  id="TDPDeltaDot"
                  class="gamepadslider_SliderHandle_2yVKj"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
