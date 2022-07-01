import { Component, ComponentChildren, createRef } from 'preact';
import { SMM } from './types/SMM';
import { PowerTools } from './util';
import { Battery } from './components/Battery';
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
      <body style="/*margin:0px;padding:0px;*/ overflow-x: hidden; margin: 0px">
        <SystemLabel smm={props.smm} pt={props.pt} />
        <TDPControl smm={props.smm} pt={props.pt} />
        <VersionLabel smm={props.smm} pt={props.pt} />
      </body>
    );
  }
}
