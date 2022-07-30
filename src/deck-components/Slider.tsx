import {
  Component,
  ComponentChildren,
  createRef,
  Ref,
  RefObject,
} from 'preact';

export interface SliderProps {
  children?: ComponentChildren;
  currentVal?: number;
  minVal?: number;
  maxVal?: number;
  name?: string;
  onChange: (e: Event, value: Number) => Promise<void>;
  onClick?: (e: Event) => Promise<void>;
  gamepadGroup?: string;
  gamepadItem?: string;
}

export class ValueSlider extends Component<SliderProps> {
  root: RefObject = createRef();
  sliderControl: RefObject = createRef();
  sliderDescription: RefObject = createRef();
  sliderLabel: RefObject = createRef();
  sliderTrack: RefObject = createRef();

  async onTouchStart(e: TouchEvent) {
    this.onHandleTouch(e);
  }
  async onTouchMove(e: TouchEvent) {
    this.onHandleTouch(e);
  }
  async onTouchEnd(e: TouchEvent) {
    this.props.onChange(e, this.props.currentVal);
  }
  async onMouseDown(e: MouseEvent) {
    //  this.onHandleMouse(e);
  }
  async onMouseMove(e: MouseEvent) {
    //  this.onHandleMouse(e);
  }
  async onMouseUp(e: MouseEvent) {
    //   this.onHandleMouse(e);
    // /  this.props.onChange(e, this.props.currentVal);
  }
  async onMouseOut(e: MouseEvent) {
    //    this.onHandleMouse(e);
    //   this.props.onChange(e, this.props.currentVal);
  }

  // gets the relative touch percentage from a given touch event.
  getEventPercent(eventLocation: number, objectWidth: number) {
    let touchRaw = eventLocation / objectWidth;
    let touchPercent = Math.min(Math.max(touchRaw, 0), 1);
    return touchPercent;
  }
  // returns the slider's actual parent node. If the slidertrack parent node
  // activated the event, returns that instead.
  getParentNode(e: Event, id: String) {
    let parentNode = null;
    if (e.srcElement.id === id) {
      parentNode = e.srcElement;
    } else {
      parentNode = e.srcElement.parentNode;
    }
    return parentNode;
  }

  // Extract X of touch location.
  async onHandleTouch(e: TouchEvent) {
    let target_rect = e.target.getBoundingClientRect();
    let touchLocation = e.touches[0].clientX - target_rect.left;
    await this.onHandleMove(e, touchLocation);
  }

  // Extract X of mouse location.
  async onHandleMouse(e: MouseEvent) {
    let touchLocation = e.layerX;
    await this.onHandleMove(e, touchLocation);
  }

  // Handle moving the slider by the given touch location.
  async onHandleMove(e: Event, touchLocation: number) {
    console.log(e);
    let parentNode = this.getParentNode(e, 'sliderControl');
    let touchPercent = this.getEventPercent(
      touchLocation,
      parentNode.clientWidth
    );
    this.setCurrentVal(touchPercent);
    this.setSliderState(touchPercent, parentNode);
  }

  // Sets the current value from a touch/mouse event
  setCurrentVal(eventPercent: number) {
    console.log(this.props.currentVal, eventPercent);
    this.props.currentVal = Math.ceil(
      eventPercent * (this.props.maxVal - this.props.minVal) + this.props.minVal
    );
  }

  // Decorate the TDP slider
  setSliderState(eventPercent: number, parentNode) {
    let style = `--normalized-slider-value: ${eventPercent}`;
    parentNode.setAttribute('style', style);
    this.sliderDescription.current.innerText = this.props.currentVal.toString();
  }

  // Force min/max/current values, used in parent to overwrite.
  setSliderParams(minVal: number, maxVal: number, currentVal: number) {
    this.props.minVal = minVal;
    this.props.maxVal = maxVal;
    this.props.currentVal = currentVal;
    let currentPercent = (currentVal - minVal) / (maxVal - minVal);
    this.setSliderState(currentPercent, this.sliderControl.current);
  }

  render(props: SliderProps) {
    return (
      <div class="quickaccesscontrols_PanelSectionRow_2VQ88" ref={this.root}>
        <div
          class="gamepaddialog_Field_S-_La gamepaddialog_WithFirstRow_qFXi6 gamepaddialog_WithChildrenBelow_1u5FT gamepaddialog_VerticalAlignCenter_3XNvA gamepaddialog_InlineWrapShiftsChildrenBelow_pHUb6 gamepaddialog_WithBottomSeparatorStandard_3s1Rk gamepaddialog_ChildrenWidthFixed_1ugIU gamepaddialog_ExtraPaddingOnChildrenBelow_5UO-_ gamepaddialog_StandardPadding_XRBFu gamepaddialog_HighlightOnFocus_wE4V6 Panel Focusable"
          style="--indent-level:0;"
        >
          <div class="gamepaddialog_FieldLabelRow_H9WOq">
            <div class="gamepaddialog_FieldLabel_3b0U-">
              <div class="gamepadslider_LabelText_1-PvK" ref={this.sliderLabel}>
                {props.name}
              </div>
              <div
                class="gamepadslider_DescriptionValue_2oRwF"
                ref={this.sliderDescription}
              >
                {props.description}
              </div>
            </div>
          </div>
          <div class="gamepaddialog_FieldChildren_14_HB">
            <div class="gamepadslider_SliderControlWithIcon_2M8Pt Panel Focusable">
              <div
                class="gamepadslider_SliderControlPanelGroup_MY8iY Panel Focusable"
                tabindex="0"
              >
                <div
                  class="gamepadslider_SliderControlAndNotches_1Cccx Focusable"
                  tabindex="0"
                  style="--normalized-slider-value:1;"
                >
                  <div
                    class="gamepadslider_SliderControl_3o137"
                    id="sliderControl"
                    ref={this.sliderControl}
                    ontouchstart={(e) => this.onTouchStart(e)}
                    ontouchmove={(e) => this.onTouchMove(e)}
                    ontouchend={(e) => this.onTouchEnd(e)}
                    data-cs-gp-in-group={props.gamepadGroup}
                    data-cs-gp-group={`${props.gamepadGroup}-${props.gamepadItem}`}
                  >
                    <div
                      class="gamepadslider_SliderTrack_Mq25N"
                      id="sliderTrack"
                      ref={this.sliderTrack}
                    ></div>
                    <div class="gamepadslider_SliderHandleContainer_1pQZi">
                      <div
                        class="gamepadslider_SliderHandle_2yVKj"
                        data-cs-gp-in-group={`${props.gamepadGroup}-${props.gamepadItem}`}
                        data-cs-gp-item={`${props.gamepadGroup}-${props.gamepadItem}-handle`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
