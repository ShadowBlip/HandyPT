import {
  Component,
  ComponentChildren,
  createRef,
  Ref,
  RefObject,
} from 'preact';

export interface NotchProps {
  index: number;
  gamepadGroup?: string;
  gamepadItem?: string;
  onChange?: (props: NotchProps, state: NotchState) => void;
}

export interface NotchState {
  selected?: boolean;
}

export class Notch extends Component<NotchProps> {
  ref = createRef<HTMLDivElement>();

  async componentDidMount() {
    if (!this.ref.current) {
      return;
    }

    // Observe if someone mutates our class
    const observer = new MutationObserver((mutations: MutationRecord[]) => {
      // Set the notch item to selected if we see gamepad focus
      if (this.ref.current!.classList.contains('cs-gp-focus')) {
        this.setState({ selected: true });
        if (this.props.onChange) {
          this.props.onChange(this.props, { selected: true });
        }
        return;
      }
      this.setState({ selected: false });
      if (this.props.onChange) {
        this.props.onChange(this.props, { selected: false });
      }
    });
    observer.observe(this.ref.current, {
      attributes: true,
      attributeFilter: ['class'],
      childList: false,
      characterData: false,
    });
  }

  render(props: NotchProps) {
    const gamepadItem = props.gamepadItem
      ? props.gamepadItem
      : `${props.gamepadGroup}-notch-${props.index}`;
    return (
      <div
        ref={this.ref}
        data-cs-gp-in-group={props.gamepadGroup}
        data-cs-gp-item={gamepadItem}
      ></div>
    );
  }
}

export interface SliderProps {
  children?: ComponentChildren;
  defaultVal?: number;
  minVal?: number;
  maxVal?: number;
  name?: string;
  onChange?: (value: number) => Promise<void>;
  onClick?: (e: Event) => Promise<void>;
  gamepadGroup?: string;
  gamepadItem?: string;
  steps?: number;
}

export interface SliderState {
  currentVal?: number;
  currentStep?: number;
  sliderPercent: number;
}

export class ValueSlider extends Component<SliderProps, SliderState> {
  root: RefObject<HTMLDivElement> = createRef();
  sliderControl: RefObject<HTMLDivElement> = createRef();
  sliderDescription: RefObject<HTMLDivElement> = createRef();
  sliderLabel: RefObject<HTMLDivElement> = createRef();
  sliderTrack: RefObject<HTMLDivElement> = createRef();

  async componentDidUpdate(prevProps: SliderProps, prevState: SliderState) {
    const hasCurrentVal = Object.keys(this.state).includes('currentVal');
    if (!hasCurrentVal && this.props.defaultVal !== undefined) {
      this.setState({
        currentVal: this.props.defaultVal,
        sliderPercent: this.getPercentFromValue(this.props.defaultVal),
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

  // Calculate the percentage the given value is between the minimum and maximum
  getPercentFromValue(value: number): number {
    return (
      (value - this.props.minVal!) / (this.props.maxVal! - this.props.minVal!)
    );
  }

  // Calculate the value between minimum and maximum based on the given
  // percentage.
  getValueFromPercent(eventPercent: number): number {
    return Math.ceil(
      eventPercent * (this.props.maxVal! - this.props.minVal!) +
        this.props.minVal!
    );
  }

  async onTouchStart(e: TouchEvent) {
    this.onHandleTouch(e);
  }
  async onTouchMove(e: TouchEvent) {
    this.onHandleTouch(e);
  }
  async onTouchEnd(e: TouchEvent) {
    this.props.onChange(this.state.currentVal!);
  }

  // Extract X of touch location.
  async onHandleTouch(e: TouchEvent) {
    let target_rect = e.target!.getBoundingClientRect();
    let touchLocation = e.touches[0].clientX - target_rect.left;
    await this.onHandleMove(e, touchLocation);
  }

  async onMouseDown() {
    this.onHandleMouse(e);
  }
  async onMouseMove() {
    this.onHandleMouse(e);
  }
  async onMouseUp() {
    this.onHandleMouse(e);
    this.props.onChange(this.props.currentVal);
  }
  async onMouseOut() {
    this.onHandleMouse(e);
    this.props.onChange(this.props.currentVal);
  }

  // Extract X of mouse location.
  async onHandleMouse(e: MouseEvent) {
    let touchLocation = e.layerX;
    await this.onHandleMove(e, touchLocation);
  }

  // Handle moving the slider by the given touch location.
  async onHandleMove(e: Event, touchLocation: number) {
    let parentNode = this.getParentNode(e, 'sliderControl');
    let touchPercent = this.getEventPercent(
      touchLocation,
      parentNode.clientWidth
    );
    this.setState({
      currentVal: this.getValueFromPercent(touchPercent),
      sliderPercent: touchPercent,
    });
  }

  // Update the slider if our notch state changes
  onStepChange(props: NotchProps, state: NotchState) {
    if (!state.selected) {
      return;
    }
    const steps = this.props.steps ? this.props.steps : 0;
    const sliderPercent = props.index / (steps - 1);
    const currentVal = this.getValueFromPercent(sliderPercent)
    this.setState({
      currentVal: currentVal,
      sliderPercent: sliderPercent,
    });
    this.props.onChange(currentVal);
  }

  render(props: SliderProps, state: SliderState) {
    const numSteps = props.steps ? props.steps : 0;
    const steps: number[] = [...Array(numSteps).keys()];
    const style = `--normalized-slider-value: ${state.sliderPercent}`;

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
                {`${state.currentVal}`}
              </div>
            </div>
          </div>
          <div class="gamepaddialog_FieldChildren_14_HB">
            <div class="gamepadslider_SliderControlWithIcon_2M8Pt Panel Focusable">
              <div
                class="gamepadslider_SliderControlPanelGroup_MY8iY Panel Focusable"
                tabIndex={0}
              >
                <div
                  class="gamepadslider_SliderControlAndNotches_1Cccx Focusable"
                  tabIndex={0}
                  style="--normalized-slider-value:1;"
                >
                  <div
                    class="gamepadslider_SliderControl_3o137"
                    id="sliderControl"
                    ref={this.sliderControl}
                    style={style}
		    // Don't change these to the "correct" camel case names or they break. Preact bug.
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
                      <div class="gamepadslider_SliderHandle_2yVKj"></div>

                      <div class="gamepadslider_SliderNotchContainer_2N-a5 Panel Focusable">
                        {steps.map((step: number) => (
                          <Notch
                            onChange={(props, state) =>
                              this.onStepChange(props, state)
                            }
                            index={step}
                            gamepadGroup={`${props.gamepadGroup}-${props.gamepadItem}`}
                          />
                        ))}
                      </div>
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
