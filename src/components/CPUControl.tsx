import { Component, createRef, RefObject } from 'preact';
import { Toggle } from '../deck-components/Toggle.tsx';
import { ValueSlider } from '../deck-components/Slider.tsx';
import { SMM } from '../types/SMM';
import { PowerTools } from '../util';

export interface CPUControlProps {
  smm: SMM;
  pt: PowerTools;
}
export class CPUControl extends Component<CPUControlProps> {
  boost: RefObject<HTMLDivElement> = createRef();
  smt: RefObject<HTMLDivElement> = createRef();

  async toggleBoost(e: Event, toggleState: boolean) {
    console.log(this.props);
    const nextSetting = toggleState ? 'on' : 'off';
    console.log('nextSetting', nextSetting);
    await this.props.pt.setBoost(nextSetting);
  }

  async toggleSMT(e: Event, toggleState: boolean) {
    console.log(this.props);
    const nextSetting = toggleState ? 'on' : 'off';
    console.log('nextSetting', nextSetting);
    await this.props.pt.setSMT(nextSetting);
  }

  render(props: CPUControlProps) {
    return (
      <div
        class="quickaccesscontrols_PanelSectionRow_2VQ88"
        style="padding: 0px 4px"
      >
        <div class="quickaccesscontrols_PanelSectionTitle_2iFf9">
          <div class="quickaccesscontrols_Text_1hJkB">CPU Settings</div>
        </div>
        <Toggle
          ref={this.smt}
          enabled={true}
          onClick={(e: Event, toggleState: boolean) =>
            this.toggleSMT(e, toggleState)
          }
          name="Similtanious Multithreading"
          description="Improves performance in some games. Recommended on for most titles."
          data-cs-gp-in-group="cpu"
          data-cs-gp-item="SMT_Toggle"
        />
        <Toggle
          ref={this.boost}
          enabled={true}
          onClick={(e: Event, toggleState: boolean) =>
            this.toggleBoost(e, toggleState)
          }
          name="CPU Boosting"
          description="Reduces maximum CPU Frequency and power draw. May improve performance in some GPU bound games."
          data-cs-gp-in-group="cpu"
          data-cs-gp-item="Boost_Toggle"
        />
      </div>
    );
  }
}
