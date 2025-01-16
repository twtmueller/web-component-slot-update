

class EventEmission extends HTMLElement {

  shadow;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadow.appendChild(this.renderWidget());
  }

  renderWidget() {
    const rootElement = document.createElement('div');
    rootElement.innerHTML = this.markup;
    return rootElement;
  }

  markup = '<div><h4><slot name="headline">Here is my element</slot></h4><div style="width:200px;height:200px;border:1px solid #777"><slot name="content"></slot></div><footer>Here is some footer</footer></div>'

}

customElements.define('event-emission', EventEmission);
