import { Component, ComponentChildren, createRef } from 'preact';

export interface LabelProperties {
  children?: ComponentChildren;
  id?: string;
  setInnerText?: () => void;
}

export class Label extends Component<LabelProperties> {
  innerText: string = '';
  ref = createRef();
  setInnerText(innerText: string) {
    this.innerText = innerText;
  }
  render(properties: LabelProperties) {
    return (
      <div
        id="{properties.id}"
        class="gamepaddialog_LabelFieldValue_5Mylh"
        ref={this.ref}
      >
        {this.innerText}
      </div>
    );
  }
}
