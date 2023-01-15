import { Component, createRef } from "preact";
import { BTN_CODE, GAMEPAD_FOCUSED, onGamepadFocus } from "./Gamepad";

const FIELD_CLASSES =
  "gamepaddialog_Field_S-_La gamepaddialog_WithFirstRow_qFXi6 gamepaddialog_WithChildrenBelow_1u5FT gamepaddialog_VerticalAlignCenter_3XNvA gamepaddialog_InlineWrapShiftsChildrenBelow_pHUb6 gamepaddialog_WithBottomSeparatorStandard_3s1Rk gamepaddialog_ChildrenWidthFixed_1ugIU gamepaddialog_ExtraPaddingOnChildrenBelow_5UO-_ gamepaddialog_StandardPadding_XRBFu gamepaddialog_HighlightOnFocus_wE4V6 Panel Focusable";

export interface SliderProps {
  label?: string; // Slider name, shows top left.
  description?: string; // Functional details, shows below, small text
  value?: number;
  step?: number;
  max?: number;
  min?: number;
  showValue?: boolean; // if true shows value top right
  onChange: (value: number) => void;
  gamepadGroup?: string;
  gamepadItem?: string;
}

export interface SliderState {
  propValue?: number;
  currentVal?: number;
  focused?: boolean;
}

export class SliderField extends Component<SliderProps, SliderState> {
  ref = createRef<HTMLDivElement>();
  async onTouchStart(e: TouchEvent) {
    this.onHandleTouch(e);
  }
  async onTouchMove(e: TouchEvent) {
    this.onHandleTouch(e);
  }
  async onTouchEnd(e: TouchEvent) {
    this.props.onChange(this.state.currentVal!);
  }

  componentDidMount() {
    if (!this.ref.current) {
      return;
    }

    const options = {
      capture: true,
      passive: true,
      once: false,
    };
    this.ref.current.addEventListener(
      "cs-gp-button-down",
      (event: any) => {
        // Ignore button presses we don't care about
        if (
          ![BTN_CODE.RIGHT, BTN_CODE.LEFT].includes(event.detail.buttonCode)
        ) {
          return;
        }

        const step = this.props.step ? this.props.step : 1;
        const min = this.props.min ? this.props.min : 0;
        const max = this.props.max ? this.props.max : 100;
        const current =
          this.state.currentVal !== undefined ? this.state.currentVal : max;

        if (event.detail.buttonCode === BTN_CODE.RIGHT) {
          const value = Math.min(max, current + step);
          this.setState({ currentVal: value });
          this.props.onChange(value);
          return;
        }
        if (event.detail.buttonCode === BTN_CODE.LEFT) {
          const value = Math.max(min, current - step);
          this.setState({ currentVal: value });
          this.props.onChange(value);
          return;
        }
      },
      options
    );

    // Watch for gamepad focus events
    onGamepadFocus(this.ref.current, (isFocused) => {
      this.setState({ focused: isFocused });
    });
  }

  componentDidUpdate(prevProps: SliderProps, prevState: SliderState): void {
    if (
      this.props.value !== undefined &&
      this.props.value !== this.state.propValue &&
      this.state.currentVal !== this.props.value
    ) {
      this.setState({
        currentVal: this.props.value,
        propValue: this.props.value,
      });
    }
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
    let target_rect = e.target!.getBoundingClientRect();
    let touchLocation = e.touches[0].clientX - target_rect.left;
    await this.onHandleMove(e, touchLocation);
  }

  // Handle moving the slider by the given touch location.
  async onHandleMove(e: Event, touchLocation: number) {
    let parentNode = this.getParentNode(e, "sliderControl");
    let touchPercent = this.getEventPercent(
      touchLocation,
      parentNode.clientWidth
    );
    this.setState({
      currentVal: this.getValueFromPercent(touchPercent),
    });
  }

  // Calculate the value between minimum and maximum based on the given
  // percentage.
  getValueFromPercent(eventPercent: number): number {
    return Math.ceil(
      eventPercent * (this.props.max! - this.props.min!) + this.props.min!
    );
  }

  // Calculate the percentage the given value is between the minimum and maximum
  getPercentFromValue(value: number): number {
    return (value - this.props.min!) / (this.props.max! - this.props.min!);
  }

  render(props: SliderProps, state: SliderState) {
    const current = props.showValue ? state.currentVal : "";
    // const sliderStyle = `outline: white solid 0px; --normalized-slider-value: ${this.getPercentFromValue(
    const sliderStyle = `--normalized-slider-value: ${this.getPercentFromValue(
      state.currentVal || props.min || 0
    )}`;
    const fieldClasses = state.focused
      ? `${FIELD_CLASSES} ${GAMEPAD_FOCUSED}`
      : FIELD_CLASSES;

    return (
      <div class={fieldClasses} style="--indent-level:0;" ref={this.ref}>
        <div class="gamepaddialog_FieldLabelRow_H9WOq">
          <div class="gamepaddialog_FieldLabel_3b0U-">
            <div class="gamepadslider_LabelText_1-PvK">{props.label}</div>
            <div class="gamepadslider_DescriptionValue_2oRwF">
              {`${current}`}
            </div>
          </div>
        </div>
        <div class="gamepaddialog_FieldChildren_14_HB" style="min-width: 88px;">
          <div
            ref={this.ref}
            class="gamepadslider_SliderControl_3o137"
            style={sliderStyle}
            data-cs-gp-in-group={props.gamepadGroup}
            data-cs-gp-item={props.gamepadItem}
            data-cs-gp-item-custom-events="true"
            ontouchstart={(e) => this.onTouchStart(e)}
            ontouchmove={(e) => this.onTouchMove(e)}
            ontouchend={(e) => this.onTouchEnd(e)}
          >
            <div class="gamepadslider_SliderTrack_Mq25N gamepadslider_SliderHasNotches_2XiAy" />
            <div class="gamepadslider_SliderHandleContainer_1pQZi">
              <div class="gamepadslider_SliderHandle_2yVKj" />
              <div class="gamepadslider_SliderNotchContainer_2N-a5 Panel Focusable"></div>
            </div>
          </div>
        </div>
        <div class="gamepaddialog_FieldDescription_2OJfk">
          {props.description}
        </div>
      </div>
    );
  }
}
