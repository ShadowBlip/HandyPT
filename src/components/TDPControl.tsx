import { Component, createRef, RefObject } from 'preact';
import { SMM } from '../types/SMM';
import { PowerTools } from '../util';
export interface TDPControlProperties {
  smm?: SMM;
  pt?: PowerTools;
}

export class TDPControl extends Component<TDPControlProperties> {
  default_tdp: any = null;
  root: RefObject<HTMLDivElement> = createRef();
  tdpSlider: RefObject<HTMLDivElement> = createRef();
  tdpDot: RefObject<HTMLDivElement> = createRef();
  tdpNotch0: RefObject<HTMLDivElement> = createRef();
  tdpNotch1: RefObject<HTMLDivElement> = createRef();
  tdpNotch2: RefObject<HTMLDivElement> = createRef();
  tdpNotch3: RefObject<HTMLDivElement> = createRef();
  tdpNotch4: RefObject<HTMLDivElement> = createRef();
  tdpNotch5: RefObject<HTMLDivElement> = createRef();
  tdpNotch6: RefObject<HTMLDivElement> = createRef();
  tdpNotchLabel0: RefObject<HTMLDivElement> = createRef();
  tdpNotchLabel1: RefObject<HTMLDivElement> = createRef();
  tdpNotchLabel2: RefObject<HTMLDivElement> = createRef();
  tdpNotchLabel3: RefObject<HTMLDivElement> = createRef();
  tdpNotchLabel4: RefObject<HTMLDivElement> = createRef();
  tdpNotchLabel5: RefObject<HTMLDivElement> = createRef();
  tdpNotchLabel6: RefObject<HTMLDivElement> = createRef();
  async componentDidMount() {
    if (this.root.current) {
      // Get and set our notch values
      const tdp_notches = await this.props.pt?.get_tdp_notches();
      const html_root: HTMLDivElement = this.root.current;
      this.tdpNotchLabel0.current!.innerText =
        tdp_notches!.tdp_notch0_val!.toString();
      this.tdpNotchLabel1.current!.innerText =
        tdp_notches!.tdp_notch1_val!.toString();
      this.tdpNotchLabel2.current!.innerText =
        tdp_notches!.tdp_notch2_val!.toString();
      this.tdpNotchLabel3.current!.innerText =
        tdp_notches!.tdp_notch3_val!.toString();
      this.tdpNotchLabel4.current!.innerText =
        tdp_notches!.tdp_notch4_val!.toString();
      this.tdpNotchLabel5.current!.innerText =
        tdp_notches!.tdp_notch5_val!.toString();
      this.tdpNotchLabel6.current!.innerText =
        tdp_notches!.tdp_notch6_val!.toString();

      // Get our current TDP
      const current_tdp = await this.props.pt?.readGPUProp('0x0000');

      // TODO: this will need to change once persistance is enabled.
      if (current_tdp != tdp_notches!.tdp_notch3_val!) {
        await this.setTDPNotch(tdp_notches!.tdp_notch3_val);
      }
    }
  }
  
  async setTDPNotch(setTDP: number) {
    
    const current_tdp = await this.props.pt?.readGPUProp('0x0000');
    //set the correct TDP value
    await this.props.pt?.setGPUProp(setTDP, 'a');
    await this.props.pt?.setGPUProp(setTDP, 'b');
    await this.props.pt?.setGPUProp(setTDP, 'c');
    const new_tdp = await this.props.pt?.readGPUProp('0x0000');
    console.log('TDP was ', current_tdp, ' and was set to ', new_tdp);
    // identify the correct index of the element
    // move the parent slider to the correct value
  }
    
  // Runs when this component is unloaded
  async componentWillUnmount() {}

  // renders the GUI
  render(properties: TDPControlProperties) {
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
              ref={this.tdpSlider}
              class="gamepadslider_SliderControlAndNotches_1Cccx Focusable"
              tabIndex={0}
              style="--normalized-slider-value: 0.33"
            >
              <div class="gamepaddialog_FieldDescription_2OJfk">GPU TDP</div>
              <div class="gamepadslider_SliderControl_3o137">
                <div class="gamepadslider_SliderTrack_Mq25N gamepadslider_SliderHasNotches_2XiAy"></div>
                <div class="gamepadslider_SliderHandleContainer_1pQZi">
                  <div
                    ref={this.tdpDot}
                    class="gamepadslider_SliderHandle_2yVKj"
                  ></div>
                </div>
              </div>
              <div class="gamepadslider_SliderNotchContainer_2N-a5 Panel Focusable">
                <div class="gamepadslider_SliderNotch_3x6ve">
                  <div
                    ref={this.tdpNotch0}
                    class="gamepadslider_SliderNotchTick_Fv1Ht gamepadslider_TickActive_j418S"
                  ></div>
                  <div
                    ref={this.tdpNotchLabel0}
                    class="gamepadslider_SliderNotchLabel_u_sH1"
                  ></div>
                </div>
                <div class="gamepadslider_SliderNotch_3x6ve">
                  <div
                    ref={this.tdpNotch1}
                    class="gamepadslider_SliderNotchTick_Fv1Ht gamepadslider_TickActive_j418S"
                  ></div>
                  <div
                    ref={this.tdpNotchLabel1}
                    class="gamepadslider_SliderNotchLabel_u_sH1"
                  ></div>
                </div>
                <div class="gamepadslider_SliderNotch_3x6ve">
                  <div
                    ref={this.tdpNotch2}
                    class="gamepadslider_SliderNotchTick_Fv1Ht gamepadslider_TickActive_j418S"
                  ></div>
                  <div
                    ref={this.tdpNotchLabel2}
                    class="gamepadslider_SliderNotchLabel_u_sH1"
                  ></div>
                </div>
                <div class="gamepadslider_SliderNotch_3x6ve">
                  <div
                    ref={this.tdpNotch3}
                    class="gamepadslider_SliderNotchTick_Fv1Ht gamepadslider_TickActive_j418S"
                  ></div>
                  <div
                    ref={this.tdpNotchLabel3}
                    class="gamepadslider_SliderNotchLabel_u_sH1"
                  ></div>
                </div>
                <div class="gamepadslider_SliderNotch_3x6ve">
                  <div
                    ref={this.tdpNotch4}
                    class="gamepadslider_SliderNotchTick_Fv1Ht gamepadslider_TickActive_j418S"
                  ></div>
                  <div
                    ref={this.tdpNotchLabel4}
                    class="gamepadslider_SliderNotchLabel_u_sH1"
                  ></div>
                </div>
                <div class="gamepadslider_SliderNotch_3x6ve">
                  <div
                    ref={this.tdpNotch5}
                    class="gamepadslider_SliderNotchTick_Fv1Ht gamepadslider_TickActive_j418S"
                  ></div>
                  <div
                    ref={this.tdpNotchLabel5}
                    class="gamepadslider_SliderNotchLabel_u_sH1"
                  ></div>
                </div>
                <div class="gamepadslider_SliderNotch_3x6ve">
                  <div
                    ref={this.tdpNotch6}
                    class="gamepadslider_SliderNotchTick_Fv1Ht gamepadslider_TickActive_j418S"
                  ></div>
                  <div
                    ref={this.tdpNotchLabel6}
                    class="gamepadslider_SliderNotchLabel_u_sH1"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div class="gamepaddialog_FieldChildren_14_HB">
            <div
              id="TDPDeltaNotch"
              class="gamepadslider_SliderControlAndNotches_1Cccx Focusable"
              tabIndex={0}
              style="--normalized-slider-value: 0.33"
            >
              <div class="gamepaddialog_FieldDescription_2OJfk">
                GPU TDP Boost Limit
              </div>
              <div class="gamepadslider_SliderControl_3o137">
                <div class="gamepadslider_SliderTrack_Mq25N gamepadslider_SliderHasNotches_2XiAy"></div>
                <div class="gamepadslider_SliderHandleContainer_1pQZi">
                  <div
                    id="TDPDeltaDot"
                    class="gamepadslider_SliderHandle_2yVKj"
                  ></div>
                </div>
              </div>
              <div class="gamepadslider_SliderNotchContainer_2N-a5 Panel Focusable">
                <div class="gamepadslider_SliderNotch_3x6ve">
                  <div
                    id="TDPDeltaNotch0"
                    class="gamepadslider_SliderNotchTick_Fv1Ht gamepadslider_TickActive_j418S"
                  ></div>
                  <div
                    id="TDPDeltaNotch0_Lab"
                    class="gamepadslider_SliderNotchLabel_u_sH1"
                  >
                    +2
                  </div>
                </div>
                <div class="gamepadslider_SliderNotch_3x6ve">
                  <div
                    id="TDPDeltaNotch1"
                    class="gamepadslider_SliderNotchTick_Fv1Ht gamepadslider_TickActive_j418S"
                  ></div>
                  <div
                    id="TDPDeltaNotch1_Lab"
                    class="gamepadslider_SliderNotchLabel_u_sH1"
                  >
                    +3
                  </div>
                </div>
                <div class="gamepadslider_SliderNotch_3x6ve">
                  <div
                    id="TDPDeltaNotch2"
                    class="gamepadslider_SliderNotchTick_Fv1Ht gamepadslider_TickActive_j418S"
                  ></div>
                  <div
                    id="TDPDeltaNotch2_Lab"
                    class="gamepadslider_SliderNotchLabel_u_sH1"
                  >
                    +4
                  </div>
                </div>
                <div class="gamepadslider_SliderNotch_3x6ve">
                  <div
                    id="TDPDeltaNotch3"
                    class="gamepadslider_SliderNotchTick_Fv1Ht gamepadslider_TickActive_j418S"
                  ></div>
                  <div
                    id="TDPDeltaNotch3_Lab"
                    class="gamepadslider_SliderNotchLabel_u_sH1"
                  >
                    +5
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
