

class EventEmission extends HTMLElement {

  shadowRoot;
  contentSlot;
  contentChangeDetectionDisabled = false;

  constructor() {
    super();
    this.shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    console.log('ID', this.id);
    this.shadowRoot.appendChild(this.renderWidget());
    this.setupSlotUpdateListener();
    this.addMarkupToHistory(new Event('initialLoad'));
    this.setupSlotObserver();
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

  setupSlotObserver() {
    console.log('Slot Observer', this);
    // const slotTarget = this.shadowRoot.querySelector('slot[name=content]').parentNode;
    // console.log('slotTarget', slotTarget);
    // if (slotTarget) {
    const mutationConfig = { attributes: true, childList: true, subtree: true };
    this.slotObserver = new MutationObserver(this.onWebComponentContentChange);
    this.slotObserver.observe(this, mutationConfig);
    // }
  }
  
  onWebComponentContentChange = mutationRecord => {
    if (!this.contentChangeDetectionDisabled) {
      const newContentRootNode = mutationRecord[0].addedNodes[0];
      console.log('NEW Content', newContentRootNode);
      this.clearAllSlotAttributes();
      this.populateSlotWith(newContentRootNode);
      this.addMarkupToHistory();
      this.markCurrentElementInSlotAs()
    }
  }

  markCurrentElementInSlotAs(slotNumber) {
    const allElements = this.querySelectorAll(`#${this.id} > * `);
    this.clearAllSlotAttributes(allElements);
    if (!slotNumber) slotNumber = allElements.length - 1;
    allElements.item(slotNumber).setAttribute('slot', 'content');
  }

  clearAllSlotAttributes(allElements) {
    if (!allElements) allElements = this.querySelectorAll(`#${this.id} > * `);
    allElements.forEach(node => node.removeAttribute('slot'));
    console.log('ALL ELEMENTS', allElements);
  }

  populateSlotWith(html) {
    this.contentChangeDetectionDisabled = true;
    const componentHistoryNodes = document.querySelectorAll(`#${this.id} > *`);
    const webComponentRootNode = document.getElementById(this.id);
    console.log('HISTORY NODES', componentHistoryNodes);
    const nodeToShow = componentHistoryNodes[componentHistoryNodes.length - 1];
    nodeToShow.setAttribute('slot', 'content');
    console.log('NODE TO SHOW', nodeToShow);
    webComponentRootNode.appendChild(html);
    this.contentChangeDetectionDisabled = false;
  }


  backButton = '<button>Back</button>';
  template = '<div style="background:#eee;width:20em;border:1px solid #333;border-radius:4px">'+this.backButton+'<h4><slot name="headline">Here is my element</slot></h4><div style="width:200px;height:200px;border:1px solid #333;background:#ab2"><slot name="content"></slot></div><button data-action="do-something">Outside slot</button><footer>Here is some footer</footer></div>'

}

customElements.define('event-emission', EventEmission);
