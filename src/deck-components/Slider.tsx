import { Component, ComponentProps, createRef, RefObject } from 'preact';
import { ItemProps } from './Item';

export class SliderControl extends Component {
  ref: RefObject<HTMLDivElement> = createRef();
  render(props: ComponentProps<any>) {
    return (
      <div class="gamepadslider_SliderControl_3o137">
        <div class="gamepadslider_SliderTrack_Mq25N gamepadslider_SliderHasNotches_2XiAy"></div>
        <div class="gamepadslider_SliderHandleContainer_1pQZi">
          <div ref={this.ref} class="gamepadslider_SliderHandle_2yVKj"></div>
        </div>
      </div>
    );
  }
}

const TICK_ACTIVE = 'gamepadslider_TickActive_1gnUV';
export class SliderNotch extends Component<ItemProps> {
  notchRef: RefObject<HTMLDivElement> = createRef();
  notchLabelRef: RefObject<HTMLDivElement> = createRef();
  render(props: ItemProps) {
    return (
      <div class="gamepadslider_SliderNotch_3x6ve">
        <div
          ref={this.notchRef}
          class="gamepadslider_SliderNotchTick_Fv1Ht gamepadslider_TickActive_j418S"
        ></div>
        <div
          ref={this.notchLabelRef}
          class="gamepadslider_SliderNotchLabel_u_sH1"
        >
          {props.label}
        </div>
      </div>
    );
  }
}

export interface SliderProps extends ItemProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  notchCount?: number;
  notchLabels?: string[];
  notchTicksVisible?: boolean;
  showValue?: boolean;
  resetValue?: number;
  disabled?: boolean;
  editableValue?: boolean;
  validValues?: 'steps' | 'range' | ((value: number) => boolean);
  valueSuffix?: string;
  minimumDpadGranularity?: number;
  onChange?(value: number): void;
}

export class Slider extends Component<SliderProps> {
  ref: RefObject<HTMLDivElement> = createRef();

  // Calculates the normalized slider value based on min/max. This
  // will return a value between 0.0 - 1.0
  getSliderNormalizedValue(value: number): number {
    // Assume a minimum of 0 if not provided, and 100 if no max.
    const min = this.props.min ? this.props.min : 0;
    const max = this.props.max ? this.props.max : 100;

    const range = max - min;
    const normalizedValue = value - min;

    return normalizedValue / range;
  }

  setSliderValue(value: number) {
    const sliderControl = this.ref.current;
    if (!sliderControl) {
      return;
    }
    const sliderValue = this.getSliderNormalizedValue(this.props.value);
    const style = `--normalized-slider-value: ${sliderValue}`;
    sliderControl.setAttribute('style', style);
  }

  componentDidMount() {
    if (!this.ref.current) {
      return;
    }
    this.setSliderValue(this.props.value);
  }

  render(props: SliderProps) {
    // Build the slider notches properties
    const notchesProps: ItemProps[] = [];
    if (props.notchCount) {
      for (let i = 0; i < props.notchCount; i++) {
        const notchProps: ItemProps = {};
        if (props.notchLabels && props.notchLabels[i]) {
          notchProps.label = props.notchLabels[i];
        }
        notchesProps.push(notchProps);
      }
    }

    return (
      <div
        ref={this.ref}
        class="gamepadslider_SliderControlAndNotches_1Cccx Focusable"
        tabIndex={0}
      >
        <div class="gamepaddialog_FieldDescription_2OJfk">{props.label}</div>
        <SliderControl />
        <div class="gamepadslider_SliderNotchContainer_2N-a5 Panel Focusable">
          {notchesProps.map((notchProps) => {
            return <SliderNotch {...notchProps} />;
          })}
        </div>
      </div>
    );
  }
}
