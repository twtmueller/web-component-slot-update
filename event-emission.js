

class EventEmission extends HTMLElement {

  shadowRoot;
  contentSlot;

  constructor() {
    super();
    this.shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(this.renderWidget());
    this.setupSlotUpdateListener();
    this.addMarkupToHistory(new Event('initialLoad'));
  }

  addMarkupToHistory(e) {
    const slotContent = this.contentSlot.assignedNodes()[0].cloneNode();
    slotContent.removeAttribute('slot');
    console.log('Slot changed', slotContent, e);

    const historyNode = document.createElement('div');
    historyNode.setAttribute('data-priority', 1)
    historyNode.appendChild(slotContent);
  }

  setupSlotUpdateListener() {
    this.contentSlot = this.shadowRoot.querySelectorAll('slot').item(1)
    console.log('SLOT', this.contentSlot);

    this.contentSlot.addEventListener('slotchange', this.addMarkupToHistory);
  }

  renderWidget() {
    const rootElement = document.createElement('div');
    rootElement.innerHTML = this.template;
    rootElement.onclick = this.reactToClick
    return rootElement;
  }

  reactToClick = event => {
    // TODO: traverse up HTML to find a data-action attr to allow nested element to receive clicks
    const requestedAction = event.target.getAttribute('data-action') || false;
    console.log('Trigger event', requestedAction, event);
    switch (requestedAction) {
      case 'do-something':
        this.emitEventOfType('innerClick', {count: Math.trunc(Math.random() * 1000)});
        break;

      case 'tpl:replaceFirst':

      default:
        if (requestedAction) this.emitEventOfType(requestedAction, event);
    }
  }

  emitEventOfType = (type, detail = {}) => {
    const event = new CustomEvent(type, {
      bubbles: true,
      cancelable: true,
      detail
    });
    console.log('Event triggered', type, this);
    return this.dispatchEvent(event);
  }

  backButton = '<button>Back</button>';
  template = '<div style="background:#eee;width:20em;border:1px solid #333;border-radius:4px">'+this.backButton+'<h4><slot name="headline">Here is my element</slot></h4><div style="width:200px;height:200px;border:1px solid #333;background:#ab2"><slot name="content"></slot></div><button data-action="do-something">Outside slot</button><footer>Here is some footer</footer></div>'

}

customElements.define('event-emission', EventEmission);
