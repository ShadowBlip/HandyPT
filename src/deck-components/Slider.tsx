      
export class Toggle extends Component<ToggleProperties> {

  async onTouchStart(e) {
  }
  async onTouchMove(e) {
  }
  async onTouchEnd(e) {
  }
  async onMouseDown(e) {
  }
  async onMouseMove(e) {
  }
  async onMouseUp(e) {
  }
  async onMouseOut(e) {
  }

  render(properties: ToggleProperties) {
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
              ref={this.sliderLabel}
            />
            <div
              class="gamepadslider_SliderControl_3o137"
              ref={this.sliderControl}
              ontouchstart={(e) => this.onTouchStart(e)}
              ontouchmove={(e) => this.onTouchMove(e)}
              ontouchend={(e) => this.onTouchEnd(e)}
              onMouseDown={(e) => this.onMouseDown(e)}
              onMouseMove={(e) => this.onMouseMove(e)}
              onMouseUp={(e) => this.onMouseUp(e)}
              onMouseOut={(e) => this.onMouseOut(e)}
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
        </div>
      </div>
    );
  }
}
