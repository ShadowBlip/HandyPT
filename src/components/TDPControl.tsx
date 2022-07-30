import { Component, createRef, RefObject } from 'preact';
import { SMM } from '../types/SMM';
import { PowerTools } from '../util';
export interface TDPControlProps {
  smm: SMM;
  pt: PowerTools;
}

export interface TDPControlState {
  current_tdp: number;
  current_boost: number;
  tdp_default_val: number;
  tdp_max_val: number;
  tdp_min_val: number;
  tdp_slider_percent: number;
  boost_slider_percent: number;
}

export class TDPControl extends Component<TDPControlProps, TDPControlState> {
  // RefObjects
  boostLabel: RefObject<HTMLDivElement> = createRef();
  boostSlider: RefObject<HTMLDivElement> = createRef();
  root: RefObject<HTMLDivElement> = createRef();
  tdpLabel: RefObject<HTMLDivElement> = createRef();
  tdpSlider: RefObject<HTMLDivElement> = createRef();

  async componentDidMount() {
    if (!this.root.current) {
      return;
    }
    console.log('TDP CONTROL MOUNTED');
    // Get and set our range values
    const tdp_range = await this.props.pt.getTDPRange();

    const tdp_max_val = tdp_range.tdp_max_val!;
    const tdp_min_val = tdp_range.tdp_min_val!;
    const tdp_default_val = tdp_range.tdp_default_val!;

    // Get our current TDP and set to default or persisted value.
    const current_tdp = await this.props.pt.readGPUProp('0x0000');
    if (current_tdp !== tdp_default_val) {
      this.setTDP(tdp_default_val);
    }
    let tdp_slider_percent =
      (tdp_default_val - tdp_min_val) / (tdp_max_val - tdp_min_val);

    this.setState({
      tdp_max_val: tdp_max_val,
      tdp_min_val: tdp_min_val,
      tdp_default_val: tdp_default_val,
      current_tdp: current_tdp,
      tdp_slider_percent: tdp_slider_percent,
      boost_slider_percent: 0,
    });
    console.log('SET STATE');
  }

  // Runs when this component is unloaded
  async componentWillUnmount() {}

  // GENERICS
  // gets the relative touch percentage from a given touch event.
  getEventPercent(event_location: number, object_width: number) {
    let touch_raw = event_location / object_width;
    let touch_percent = Math.min(Math.max(touch_raw, 0), 1);
    return touch_percent;
  }

  // returns the slider's actual parent node. If the slidertrack parent node
  // activated the event, returns that instead.
  getParentNode(e, id) {
    let parentNode = null;
    if (e.srcElement.id === id) {
      parentNode = e.srcElement;
    } else {
      parentNode = e.srcElement.parentNode;
    }
    return parentNode;
  }

  // Only set the TDP when we are done sliding.
  async onEndSlide(e: any) {
    await this.setTDP(this.state.current_tdp);
  }

  // Set the TDP to the given value
  async setTDP(tdp_val: number) {
    //set the correct TDP value
    let fast_ppt = tdp_val + this.state.current_boost;
    let slow_ppt = tdp_val + Math.ceil(this.state.current_boost / 2);
    await this.props.pt.setGPUProp(tdp_val, 'a');
    await this.props.pt.setGPUProp(fast_ppt, 'b');
    await this.props.pt.setGPUProp(slow_ppt, 'c');
  }

  // TDP SLIDER SECTION
  // Handle touch events on TDP slider.
  async onTouchSlideTDP(e: any) {
    let target_rect = e.target.getBoundingClientRect();
    let touch_location = e.touches[0].clientX - target_rect.x;
    let touch_percent = this.getEventPercent(touch_location, target_rect.x);
    this.setTDPSliderState(touch_percent);
  }
  // Handle mouse events on TDP slider.
  async onMouseSlideTDP(e: any) {
    let parentNode = this.getParentNode(e, 'tdpSlider');
    let touch_location = e.layerX;
    let touch_percent = this.getEventPercent(
      touch_location,
      parentNode.clientWidth
    );
    this.setTDPSliderState(touch_percent);
  }

  // Decorate the TDP slider and set global vars
  setTDPSliderState(event_percent: number) {
    let tdp_val = Math.ceil(
      event_percent * (this.state.tdp_max_val - this.state.tdp_min_val) +
        this.state.tdp_min_val
    );
    this.setState({ current_tdp: tdp_val, tdp_slider_percent: event_percent });
  }

  // BOOST SECTION
  // Handle touch events on boost slider.
  async onTouchSlideBoost(e: any) {
    let target_rect = e.target.getBoundingClientRect();
    let touch_location = e.touches[0].clientX - target_rect.x;
    let touch_percent = this.getEventPercent(touch_location, target_rect.x);
    this.setBoostSliderState(touch_percent);
  }

  // Handle mouse events on boost slider.
  async onMouseSlideBoost(e: any) {
    let parentNode = this.getParentNode(e, 'boostSlider');
    let touch_location = e.layerX;
    let touch_percent = this.getEventPercent(
      touch_location,
      parentNode.clientWidth
    );
    this.setBoostSliderState(touch_percent);
  }

  // Decorate the boost slider and set global vars
  setBoostSliderState(event_percent: number) {
    //TODO get min/max of the srcElement
    let boost_val = Math.ceil(event_percent * (4 - 0) + 0);
    this.setState({
      current_boost: boost_val,
      boost_slider_percent: event_percent,
    });
  }

  // VIEW SECTION
  // renders the GUI
  render(properties: TDPControlProps, state: TDPControlState) {
    console.log('RENDING TDP CONTROL');
    console.log(state);
    const tdpLabelText = `GPU TDP: ${state.current_tdp}`;
    const tdpSliderStyle = `--normalized-slider-value: ${state.tdp_slider_percent}`;
    const boostLabelText = `GPU TDP Boost: ${state.current_boost}`;
    const boostSliderStyle = `--normalized-slider-value: ${state.boost_slider_percent}`;
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
            <div
              class="gamepaddialog_FieldDescription_2OJfk"
              ref={this.tdpLabel}
            >
              {tdpLabelText}
            </div>
            <div
              class="gamepadslider_SliderControl_3o137"
              ref={this.tdpSlider}
              ontouchstart={(e) => this.onTouchSlideTDP(e)}
              ontouchmove={(e) => this.onTouchSlideTDP(e)}
              onMouseDown={(e) => this.onMouseSlideTDP(e)}
              onMouseMove={(e) => this.onMouseSlideTDP(e)}
              ontouchend={(e) => this.onEndSlide(e)}
              onMouseUp={(e) => this.onEndSlide(e)}
              onMouseOut={(e) => this.onEndSlide(e)}
              style={tdpSliderStyle}
              id="tdpSlider"
            >
              <div
                class="gamepadslider_SliderTrack_Mq25N gamepadslider_SliderHasNotches_2XiAy"
                id="tdpSliderTrack"
              />
              <div class="gamepadslider_SliderHandleContainer_1pQZi">
                <div class="gamepadslider_SliderHandle_2yVKj" />
              </div>
            </div>
          </div>
          <div class="gamepaddialog_FieldChildren_14_HB">
            <div
              class="gamepaddialog_FieldDescription_2OJfk"
              ref={this.boostLabel}
            >
              {boostLabelText}
            </div>
            <div
              class="gamepadslider_SliderControl_3o137"
              ref={this.boostSlider}
              ontouchstart={(e) => this.onTouchSlideBoost(e)}
              ontouchmove={(e) => this.onTouchSlideBoost(e)}
              onMouseDown={(e) => this.onMouseSlideBoost(e)}
              onMouseMove={(e) => this.onMouseSlideBoost(e)}
              ontouchend={(e) => this.onEndSlide(e)}
              onMouseUp={(e) => this.onEndSlide(e)}
              onMouseOut={(e) => this.onEndSlide(e)}
              style={boostSliderStyle}
              id="boostSlider"
            >
              <div
                class="gamepadslider_SliderTrack_Mq25N gamepadslider_SliderHasNotches_2XiAy"
                id="boostSliderTrack"
              />
              <div class="gamepadslider_SliderHandleContainer_1pQZi">
                <div class="gamepadslider_SliderHandle_2yVKj" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
