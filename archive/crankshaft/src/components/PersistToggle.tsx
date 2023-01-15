import { Component, ComponentChildren, createRef } from 'preact';
import { AppProps } from '../view';
import { Toggle } from '../deck-components/Toggle';
import { SMM } from '../types/smm';
import { PowerTools } from '../util';

export interface PersistProps {
  smm: SMM;
  pt: PowerTools;
  children?: ComponentChildren;
}

export class PersistToggle extends Component<PersistProps> {
  ref = createRef();
  constructor(props: PersistProps) {
    super(props);
  }

  async componentDidMount() {}

  async componentWillUnmount() {}

  render(props: AppProps) {
    return (
      <Toggle
        ref={this.ref}
        enabled={true}
        name="Persist Changes"
        description="Restores settings after a reboot"
        gamepadGroup="handy"
        gamepadItem="handy-persist-toggle"
      />
    );
  }
}
