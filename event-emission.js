

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
    this.setupSlotObserver();
  }

  renderWidget() {
    const rootElement = document.createElement('div');
    rootElement.innerHTML = this.template;
    rootElement.onclick = this.reactToClick
    return rootElement;
  }

  setupSlotUpdateListener() {
    this.contentSlot = this.shadowRoot.querySelectorAll('slot').item(1)
    this.contentSlot.addEventListener('slotchange', this.addMarkupToHistory);
  }

  addMarkupToHistory(e) {
    const slotContent = this.contentSlot.assignedNodes()[0].cloneNode();
    slotContent.removeAttribute('slot');

    const historyNode = document.createElement('div');
    historyNode.appendChild(slotContent);
  }

  setupSlotObserver() {
    const mutationConfig = { attributes: false, childList: true, subtree: true };
    this.slotObserver = new MutationObserver(this.markCurrentElementInSlotAs.bind(this));
    this.slotObserver.observe(this, mutationConfig);
  }

  reactToClick = clickEvent => {
    // TODO: traverse up HTML to find a data-action attr to allow nested element to receive clicks
    const requestedAction = clickEvent.target.getAttribute('data-action') || false;

    switch (requestedAction) {

      case 'internal:history-back-one':
        this.goBackInHistory(-1);
        break;

      case 'internal:outside-slot':
        console.log('COMPOSE EVENT', clickEvent.target);
        this.emitEventOfType('btnClick:outside-slot', {action: requestedAction});
        break

      default:
        if (requestedAction) this.emitEventOfType(requestedAction, clickEvent);
    }
  }

  emitEventOfType = (type, detail = {}) => {
    const event = new CustomEvent(type, {
      bubbles: true,
      cancelable: true,
      detail
    });
    return this.dispatchEvent(event);
  }

  goBackInHistory(count) {
    const nodeCount = this.querySelectorAll(`#${this.id} > *`).length;
    if (nodeCount > 1) {
      const steps = count || -1;
      this.clearAllSlotAttributes();
      this.querySelector(`#${this.id} > *:last-child `).remove();
      this.querySelector(`#${this.id} > *:last-child `).setAttribute('slot', 'content');
    }
  }

  markCurrentElementInSlotAs(slotNumber) {
    this.clearAllSlotAttributes()
    const allElements = this.getAllSlottableNodes();
    this.clearAllSlotAttributes(allElements);
    const currentSlot = (typeof slotNumber == 'number') ? slotNumber : allElements.length - 1;
    allElements.item(currentSlot).setAttribute('slot', 'content');
  }

  clearAllSlotAttributes(allElements) {
    if (!allElements) allElements = this.getAllSlottableNodes();
    allElements.forEach(node => node.removeAttribute('slot'));
  }

  getAllSlottableNodes = () =>
    this.querySelectorAll(`#${this.id} > * `);


  backButton = '<button data-action="internal:history-back-one">Back</button>';
  template = '<div style="background:#eee;width:20em;border:1px solid #333;border-radius:4px">'+this.backButton+'<h4><slot name="headline">Here is my element</slot></h4><div style="width:200px;height:200px;border:1px solid #333;background:#ab2"><slot name="content"></slot></div><button data-action="internal:outside-slot">Outside slot</button><footer>Here is some footer</footer></div>'

}

customElements.define('event-emission', EventEmission);
