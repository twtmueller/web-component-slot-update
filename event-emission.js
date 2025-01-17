

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
    rootElement.onclick = this.reactToClick
    return rootElement;
  }

  reactToClick = event => {
    const requestedAction = event.target.getAttribute('data-action') || false;
    console.log('event', requestedAction);
    switch (requestedAction) {
      case 'do-something':
        this.emit('innerClick', {count: Math.trunc(Math.random() * 1000)});
        break;
    }
  }

  emit = (type, detail = {}) => {
    const event = new CustomEvent(`event-emitter:${type}`, {
      bubbles: true,
      cancelable: true,
      detail
    });

    return this.dispatchEvent(event);

  }

  markup = '<div style="background:#eee;width:20em;border:1px solid #333;border-radius:4px"><h4><slot name="headline">Here is my element</slot></h4><div style="width:200px;height:200px;border:1px solid #333;background:#ab2"><slot name="content"></slot></div><button data-action="do-something">Outside slot</button><footer>Here is some footer</footer></div>'

}

customElements.define('event-emission', EventEmission);
