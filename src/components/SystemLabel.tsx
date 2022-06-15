import { Component, createRef } from 'preact';
import { AppProps } from '../view';

export class SystemLabel extends Component<AppProps> {
  ref = createRef();
  constructor(props: AppProps) {
    super(props);
  }

  // Gets the system id
  async getSysID(): Promise<string> {
    const id = await this.props.smm.FS.readFile(
      '/sys/devices/virtual/dmi/id/product_name'
    );
    return id.trim();
  }

  async componentDidMount() {
    if (this.ref.current) {
      const label: HTMLDivElement = this.ref.current;
      label.innerText = await this.getSysID();
    }
  }

  render(props: AppProps) {
    return (
      <div
        id="sysID_Lab"
        class="quickaccesscontrols_Text_1hJkB"
        ref={this.ref}
      ></div>
    );
  }
}
