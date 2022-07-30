import { Component, ComponentChildren, createRef } from 'preact';
import { SMM } from './types/SMM';
import { PowerTools } from './util';
import { Battery } from './components/Battery';
import { CPUControl } from './components/CPUControl.tsx';
import { SystemLabel } from './components/SystemLabel';
import { TDPControl } from './components/TDPControl';
import { VersionLabel } from './components/VersionLabel';

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

  render(props: AppProps, state: any) {
    return (
      <div
        style="/*margin:0px;padding:0px;*/ overflow-x: hidden; margin: 0px"
        data-cs-gp-in-group="root"
        data-cs-gp-group="handy"
        data-cs-gp-init-focus="true"
      >
        <div data-cs-gp-in-group="handy" data-cs-gp-group="handy-info">
          <SystemLabel smm={props.smm} pt={props.pt} />
          <Battery smm={props.smm} pt={props.pt} />
        </div>
        <div data-cs-gp-in-group="handy" data-cs-gp-group="handy-cpu">
          <TDPControl smm={props.smm} pt={props.pt} />
          <CPUControl smm={props.smm} pt={props.pt} />
        </div>
        <div data-cs-gp-in-group="handy" data-cs-gp-group="handy-footer">
          <VersionLabel smm={props.smm} pt={props.pt} />
        </div>
      </div>
    );
  }
}
