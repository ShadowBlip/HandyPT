import { Component, ComponentChildren, createRef } from 'preact';

ON_CLASS = 'gamepaddialog_On_3ld7T';

export interface ToggleProperties {
  children?: ComponentChildren;
  description?: string;
  enabled?: bool;
  name?: string;
}

export class Toggle extends Component<ToggleProperties> {
  toggleButton = createRef();
  labelText = createRef();
  descriptionText = createRef();

  constructor(props: ToggleProperties) {
    super(props);
  }

  async componentDidMount() {
    this._setToggle();
  }

  async componentDidUpdate(prevProps) {
    console.log('Component Did Update', prevProps);
  }

  async onMouseDown(e) {
    this.toggle();
  }

  toggle() {
    this.props.enabled = !this.props.enabled;
    this._setToggle();
  }

  _setToggle() {
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
      <div
        class="quickaccesscontrols_PanelSection_2C0g0"
        style="padding: 0px 4px"
      >
        <div class="quickaccesscontrols_PanelSectionRow_2VQ88">
          <div
            class="gamepaddialog_Field_S-_La gamepaddialog_WithFirstRow_qFXi6 gamepaddialog_VerticalAlignCenter_3XNvA gamepaddialog_WithDescription_3bMIS gamepaddialog_ExtraPaddingOnChildrenBelow_5UO-_ gamepaddialog_StandardPadding_XRBFu gamepaddialog_HighlightOnFocus_wE4V6 Panel Focusable"
            style="--indent-level: 0"
          >
            <div class="gamepaddialog_FieldLabelRow_H9WOq">
              <div class="gamepaddialog_FieldLabel_3b0U-" ref={this.labelText}>
                {properties.name}
              </div>
              <div
                class="gamepaddialog_Toggle_24G4g Focusable"
                ref={this.toggleButton}
                onMouseDown={(e) => this.onMouseDown(e)}
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
        </div>
      </div>
    );
  }
}
