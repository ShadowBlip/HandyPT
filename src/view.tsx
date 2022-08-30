import { Component, ComponentChildren, createRef } from 'preact';
import { SMM } from './types/SMM';
import { PowerTools } from './util';
import { Battery } from './components/Battery';
import { CPUControl } from './components/CPUControl';
import { SystemLabel } from './components/SystemLabel';
import { TDPControl } from './components/TDPControl';

// Properties we can pass to the application.
export interface AppProps {
  smm: SMM;
  pt: PowerTools;
  children?: ComponentChildren;
}

export class App extends Component<AppProps> {
  system_label = createRef();
  constructor(props: AppProps) {
    super(props);
  }

  componentDidMount() {
    if (this.system_label.current) {
      this.system_label.current.innerText = this.props.pt.getVersion();
    }
  }

  render(props: AppProps, _state: any) {
    return (
      <div
        class="quickaccesscontrols_PanelSectionRow_2VQ88"
        data-cs-gp-in-group="root"
        data-cs-gp-group="handy"
        data-cs-gp-init-focus="true"
      >
        <TDPControl smm={props.smm} pt={props.pt} />
        <CPUControl smm={props.smm} pt={props.pt} />
        <Battery smm={props.smm} pt={props.pt} />
        <SystemLabel smm={props.smm} pt={props.pt} />
      </div>
    );
  }
}
