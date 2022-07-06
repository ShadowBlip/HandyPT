import { Component, createRef } from 'preact';
import { AppProps } from '../view';
import { Toggle } from '../deck-components/Toggle.tsx'

export class CPUControl extends Component<AppProps> {
  ref = createRef();
  constructor(props: AppProps) {
    super(props);
  }

  async componentDidMount() {
  }

  async componentWillUnmount() {
  }

  render(props: AppProps) {
    return (
      <div
        class="quickaccesscontrols_PanelSection_2C0g0"
        style="padding: 0px 4px"
      >
        <div class="quickaccesscontrols_PanelSectionRow_2VQ88">
          <div
            class="gamepaddialog_Field_S-_La gamepaddialog_WithFirstRow_qFXi6 gamepaddialog_VerticalAlignCenter_3XNvA gamepaddialog_InlineWrapShiftsChildrenBelow_pHUb6 gamepaddialog_WithBottomSeparator_1lUZx gamepaddialog_StandardPadding_XRBFu gamepaddialog_HighlightOnFocus_wE4V6 Panel Focusable"
            style="--indent-level: 0"
          >
        <Toggle />
          </div>
        </div>
      </div>
    );
  }
}
