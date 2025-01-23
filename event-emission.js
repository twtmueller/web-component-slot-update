

class EventEmission extends HTMLElement {

  shadowRoot;
  contentSlot;
  contentChangeDetectionDisabled = false;

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
    historyNode.setAttribute('data-priority', 1)
    historyNode.appendChild(slotContent);
  }

  setupSlotObserver() {
    const mutationConfig = { attributes: true, childList: true, subtree: true };
    this.slotObserver = new MutationObserver(this.onWebComponentContentChange);
    this.slotObserver.observe(this, mutationConfig);
  }

  reactToClick = clickEvent => {
    // TODO: traverse up HTML to find a data-action attr to allow nested element to receive clicks
    const requestedAction = clickEvent.target.getAttribute('data-action') || false;
    console.log('ACTION', requestedAction);
    console.log('ELEMENT', clickEvent.target);

    switch (requestedAction) {
      case 'do-something':
        this.emitEventOfType('innerClick', {count: Math.trunc(Math.random() * 1000)});
        break;

      case 'internal:history-back-one':
        console.log('Back button pressed', true);
        this.goBackInHistory(-1);
        break;

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
      console.log('ALL NODES BEFORE', this.getAllSlottableNodes());
      this.querySelector(`#${this.id} > *:last-child `).remove();
      this.querySelector(`#${this.id} > *:last-child `).setAttribute('slot', 'content');
    }
  }

  onWebComponentContentChange = mutationRecord => {
    if (!this.contentChangeDetectionDisabled) {
      const newContentRootNode = mutationRecord[0].addedNodes[0];
      this.clearAllSlotAttributes();
      this.populateSlotWith(newContentRootNode);
      this.addMarkupToHistory();
      this.markCurrentElementInSlotAs()
    }
  }

  markCurrentElementInSlotAs(slotNumber) {
    const allElements = this.getAllSlottableNodes();
    this.clearAllSlotAttributes(allElements);
    if (!slotNumber) slotNumber = allElements.length - 1;
    allElements.item(slotNumber).setAttribute('slot', 'content');
  }

  clearAllSlotAttributes(allElements) {
    if (!allElements) allElements = this.getAllSlottableNodes();
    allElements.forEach(node => node.removeAttribute('slot'));
  }

  getAllSlottableNodes = () =>
    this.querySelectorAll(`#${this.id} > * `);

  populateSlotWith(html) {
    this.contentChangeDetectionDisabled = true;
    const componentHistoryNodes = this.getAllSlottableNodes();
    const webComponentRootNode = document.getElementById(this.id);
    const nodeToShow = componentHistoryNodes[componentHistoryNodes.length - 1];
    nodeToShow.setAttribute('slot', 'content');
    webComponentRootNode.appendChild(html);
    this.contentChangeDetectionDisabled = false;
  }


  backButton = '<button data-action="internal:history-back-one">Back</button>';
  template = '<div style="background:#eee;width:20em;border:1px solid #333;border-radius:4px">'+this.backButton+'<h4><slot name="headline">Here is my element</slot></h4><div style="width:200px;height:200px;border:1px solid #333;background:#ab2"><slot name="content"></slot></div><button data-action="do-something">Outside slot</button><footer>Here is some footer</footer></div>'

}

customElements.define('event-emission', EventEmission);
