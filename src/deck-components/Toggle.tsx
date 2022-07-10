import { Component, ComponentChildren, createRef } from 'preact';

const ON_CLASS = 'gamepaddialog_On_3ld7T';

export interface ToggleProperties {
  children?: ComponentChildren;
  description?: string;
  enabled?: boolean;
  name?: string;
  onClick?: (e: Event, toggleState: boolean) => Promise<void>;
}

export class Toggle extends Component<ToggleProperties> {
  toggleButton = createRef();
  labelText = createRef();
  descriptionText = createRef();

  constructor(props: ToggleProperties) {
    super(props);
  }

  async componentDidMount() {
    this.setToggle();
  }

  async componentDidUpdate(prevProps: any) {
    console.log('Component Did Update', prevProps);
  }

  async onClick(e: Event) {
    this.toggle();
    console.log(this.props);
    if (this.props.onClick) {
      await this.props.onClick(e, this.props.enabled!);
    }
  }

  toggle() {
    this.props.enabled = !this.props.enabled;
    this.setToggle();
  }

  private setToggle() {
    if (
      this.props.enabled &&
      !this.toggleButton.current.classList.contains(ON_CLASS)
    ) {
      this.toggleButton.current.classList.add(ON_CLASS);
    } else if (
      !this.props.enabled &&
      this.toggleButton.current.classList.contains(ON_CLASS)
    ) {
      this.toggleButton.current.classList.remove(ON_CLASS);
    }
  }

  render(properties: ToggleProperties) {
    return (
      <div>
        <div class="gamepaddialog_FieldLabelRow_H9WOq">
          <div class="gamepaddialog_FieldLabel_3b0U-" ref={this.labelText}>
            {properties.name}
          </div>
          <div
            class="gamepaddialog_Toggle_24G4g Focusable"
            ref={this.toggleButton}
            onClick={(e) => this.onClick(e)}
          >
            <div class="gamepaddialog_ToggleRail_2JtC3"></div>
            <div class="gamepaddialog_ToggleSwitch_3__OD"></div>
          </div>
        </div>
        <div
          class="gamepaddialog_FieldDescription_2OJfk"
          ref={this.descriptionText}
        >
          {properties.description}
        </div>
      </div>
    );
  }
}
