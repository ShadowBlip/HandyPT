import {
  Component,
  ComponentChildren,
  createRef,
  Ref,
  RefObject,
} from 'preact';

export interface NotchProps {
  index: number;
  gamepadFocused?: string;
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
	data-cs-gp-init-focus={props.gamepadFocused}
	style="outline: white solid 0px;"
      />
    );
  }
}

  // Update the slider if our notch state changes
  onStepChange(props: NotchProps, state: NotchState) {
    if (!state.selected) {
      return;
    }
  }

  render(props: SliderProps, state: SliderState) {
    const numSteps = props.steps ? props.steps : 0;
    const steps: number[] = [...Array(numSteps).keys()];

    return (
      <div class="gamepadslider_SliderNotchContainer_2N-a5 Panel Focusable">
        {steps.map((step: number) => (
          <Notch
            onChange={(props, state) =>
              this.onStepChange(props, state)
            }
            index={step}
            gamepadGroup={`${props.gamepadGroup}-${props.gamepadItem}`}
           gamepadFocused={
             step === state.currentStep ? "true" : "false"
           }
          />
        ))}
      </div> 
    );
  }
}


