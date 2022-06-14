import { FunctionComponent } from 'preact';
import { SMM } from './types/SMM';
import { PowerTools } from './util';

export const App: FunctionComponent<{ smm: SMM; tools: PowerTools }> = ({
  smm,
  tools,
}) => {
  return (
    <body style="/*margin:0px;padding:0px;*/ overflow-x: hidden; margin: 0px">
      <div
        class="quickaccesscontrols_PanelSection_2C0g0"
        style="padding: 0px 4px; margin-bottom: 0px"
      >
        <div class="quickaccesscontrols_PanelSectionTitle_2iFf9"></div>
        <div class="quickaccesscontrols_PanelSectionTitle_2iFf9">
          <div class="gamepaddialog_FieldLabel_3b0U-"></div>
        </div>
      </div>
      <div class="quickaccesscontrols_PanelSectionTitle_2iFf9">
        <div id="sysID_Lab" class="quickaccesscontrols_Text_1hJkB"></div>
      </div>
      <div class="Panel Focusable" tabIndex={0}>
        <div class="quickaccesscontrols_PanelSectionRow_2VQ88">
          <div
            class="gamepaddialog_Field_S-_La gamepaddialog_WithFirstRow_qFXi6 gamepaddialog_VerticalAlignCenter_3XNvA gamepaddialog_InlineWrapShiftsChildrenBelow_pHUb6 gamepaddialog_WithBottomSeparator_1lUZx gamepaddialog_StandardPadding_XRBFu gamepaddialog_HighlightOnFocus_wE4V6 Panel Focusable"
            style="--indent-level: 0"
          >
            <div class="gamepaddialog_FieldLabelRow_H9WOq">
              <div class="gamepaddialog_FieldLabel_3b0U-">System Charge</div>
              <div class="gamepaddialog_FieldChildren_14_HB">
                <div
                  class="gamepaddialog_LabelFieldValue_5Mylh"
                  id="batCapacityNow"
                ></div>
              </div>
            </div>
          </div>
          <div
            class="gamepaddialog_Field_S-_La gamepaddialog_WithFirstRow_qFXi6 gamepaddialog_VerticalAlignCenter_3XNvA gamepaddialog_InlineWrapShiftsChildrenBelow_pHUb6 gamepaddialog_WithBottomSeparator_1lUZx gamepaddialog_StandardPadding_XRBFu gamepaddialog_HighlightOnFocus_wE4V6 Panel Focusable"
            style="--indent-level: 0"
          >
            <div class="gamepaddialog_FieldLabelRow_H9WOq">
              <div class="gamepaddialog_FieldLabel_3b0U-">
                Battery Power Draw
              </div>
              <div class="gamepaddialog_FieldChildren_14_HB">
                <div
                  class="gamepaddialog_LabelFieldValue_5Mylh"
                  id="batPowerDraw"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="quickaccesscontrols_PanelSection_2C0g0"
        style="padding: 0px 4px"
      >
        <div class="gamepaddialog_Field_S-_La gamepaddialog_WithFirstRow_qFXi6 gamepaddialog_WithChildrenBelow_1u5FT gamepaddialog_VerticalAlignCenter_3XNvA gamepaddialog_InlineWrapShiftsChildrenBelow_pHUb6 gamepaddialog_ChildrenWidthFixed_1ugIU gamepaddialog_ExtraPaddingOnChildrenBelow_5UO-_ gamepaddialog_StandardPadding_XRBFu gamepaddialog_HighlightOnFocus_wE4V6 Panel Focusable">
          <div class="quickaccesscontrols_PanelSectionTitle_2iFf9">
            <div class="quickaccesscontrols_Text_1hJkB">TDP Settings</div>
          </div>
          <div class="gamepaddialog_FieldChildren_14_HB">
            <div
              id="TDPNotch"
              class="gamepadslider_SliderControlAndNotches_1Cccx Focusable"
              tabIndex={0}
              style="--normalized-slider-value: 0.33"
            >
              <div class="gamepaddialog_FieldDescription_2OJfk">GPU TDP</div>
              <div class="gamepadslider_SliderControl_3o137">
                <div class="gamepadslider_SliderTrack_Mq25N gamepadslider_SliderHasNotches_2XiAy"></div>
                <div class="gamepadslider_SliderHandleContainer_1pQZi">
                  <div
                    id="TDPDot"
                    class="gamepadslider_SliderHandle_2yVKj"
                  ></div>
                </div>
              </div>
              <div class="gamepadslider_SliderNotchContainer_2N-a5 Panel Focusable">
                <div class="gamepadslider_SliderNotch_3x6ve">
                  <div
                    id="TDPNotch0"
                    class="gamepadslider_SliderNotchTick_Fv1Ht gamepadslider_TickActive_j418S"
                  ></div>
                  <div
                    id="TDPNotch0_Lab"
                    class="gamepadslider_SliderNotchLabel_u_sH1"
                  ></div>
                </div>
                <div class="gamepadslider_SliderNotch_3x6ve">
                  <div
                    id="TDPNotch1"
                    class="gamepadslider_SliderNotchTick_Fv1Ht gamepadslider_TickActive_j418S"
                  ></div>
                  <div
                    id="TDPNotch1_Lab"
                    class="gamepadslider_SliderNotchLabel_u_sH1"
                  ></div>
                </div>
                <div class="gamepadslider_SliderNotch_3x6ve">
                  <div
                    id="TDPNotch2"
                    class="gamepadslider_SliderNotchTick_Fv1Ht gamepadslider_TickActive_j418S"
                  ></div>
                  <div
                    id="TDPNotch2_Lab"
                    class="gamepadslider_SliderNotchLabel_u_sH1"
                  ></div>
                </div>
                <div class="gamepadslider_SliderNotch_3x6ve">
                  <div
                    id="TDPNotch3"
                    class="gamepadslider_SliderNotchTick_Fv1Ht gamepadslider_TickActive_j418S"
                  ></div>
                  <div
                    id="TDPNotch3_Lab"
                    class="gamepadslider_SliderNotchLabel_u_sH1"
                  ></div>
                </div>
                <div class="gamepadslider_SliderNotch_3x6ve">
                  <div
                    id="TDPNotch4"
                    class="gamepadslider_SliderNotchTick_Fv1Ht gamepadslider_TickActive_j418S"
                  ></div>
                  <div
                    id="TDPNotch4_Lab"
                    class="gamepadslider_SliderNotchLabel_u_sH1"
                  ></div>
                </div>
                <div class="gamepadslider_SliderNotch_3x6ve">
                  <div
                    id="TDPNotch5"
                    class="gamepadslider_SliderNotchTick_Fv1Ht gamepadslider_TickActive_j418S"
                  ></div>
                  <div
                    id="TDPNotch5_Lab"
                    class="gamepadslider_SliderNotchLabel_u_sH1"
                  ></div>
                </div>
                <div class="gamepadslider_SliderNotch_3x6ve">
                  <div
                    id="TDPNotch6"
                    class="gamepadslider_SliderNotchTick_Fv1Ht gamepadslider_TickActive_j418S"
                  ></div>
                  <div
                    id="TDPNotch6_Lab"
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
              <div class="gamepaddialog_FieldLabel_3b0U-">Persist Changes</div>
              <div class="gamepaddialog_FieldChildren_14_HB">
                <div
                  id="persistToggle"
                  tabIndex={0}
                  class="gamepaddialog_Toggle_24G4g Focusable"
                >
                  <div class="gamepaddialog_ToggleRail_2JtC3"></div>
                  <div class="gamepaddialog_ToggleSwitch_3__OD"></div>
                </div>
              </div>
            </div>
            <div class="gamepaddialog_FieldDescription_2OJfk">
              Restores settings after a reboot
            </div>
          </div>
        </div>
      </div>
      <div
        class="quickaccesscontrols_PanelSection_2C0g0"
        style="padding: 0px 4px"
      >
        <div class="quickaccesscontrols_PanelSectionRow_2VQ88">
          <div
            class="gamepaddialog_Field_S-_La gamepaddialog_WithFirstRow_qFXi6 gamepaddialog_VerticalAlignCenter_3XNvA gamepaddialog_InlineWrapShiftsChildrenBelow_pHUb6 gamepaddialog_WithBottomSeparator_1lUZx gamepaddialog_StandardPadding_XRBFu gamepaddialog_HighlightOnFocus_wE4V6 Panel Focusable"
            style="--indent-level: 0"
          >
            <div class="gamepaddialog_FieldLabelRow_H9WOq">
              <div class="gamepaddialog_FieldLabel_3b0U-">
                Aya Neo Power Tools
              </div>
              <div class="gamepaddialog_FieldChildren_14_HB">
                <div
                  class="gamepaddialog_LabelFieldValue_5Mylh"
                  id="versionStr"
                >
                  v0.0.0
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
};
