

class EventEmission extends HTMLElement {

  shadow;
  slotHistory = [];
  rootElement = document.createElement('div');
  slotObserver

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadow.appendChild(this.renderWidget());
    this.setupSlotObserver();
  }

  disconnectedCallback() {
    console.log('DISCONNECTED', );
    this.slotObserver.disconnect();
  }

  renderWidget() {
    this.rootElement.innerHTML = this.css + this.markup;
    this.rootElement.onclick = this.reactToClick

    return this.rootElement;
  }

  setupSlotObserver() {
    const slotTarget = this.shadowRoot.querySelector('slot[name=content]').parentNode;
    console.log('slotTarget', slotTarget);
    if (slotTarget) {
      const mutationConfig = { attributes: true, childList: true, subtree: true };
      this.slotObserver = new MutationObserver(this.reactToDomChange.bind(this));
      this.slotObserver.observe(slotTarget, mutationConfig);
    }
  }

  reactToDomChange = (mutationList, observer) => {
    console.log('Mutations', mutationList);
  }

  reactToClick = event => {

    const requestedAction = this.getDataActionFromHtml(event.target);
    switch (requestedAction) {
      case 'do-something':
        this.emitFromWebComponent('innerClick', {count: Math.trunc(Math.random() * 1000)});
        break;

      case 'content:navigate:back':
        // this.screenHistory.push()
        // const slotContent = this.querySelector('slot')
        console.log('Navigate back', requestedAction, this.slotHistory);
        break;

      default:
        // const currentSlotContent = this.querySelector('slot[name=content]').innerHTML;
        this.slotHistory.push(42);
        console.log('CLICK DETECTED', event.target);
        break;
    }
  }

  getDataActionFromHtml = clickedHtmlElement => {
    let currentNode = clickedHtmlElement;
    while (currentNode && currentNode.tagName.toLowerCase() !== 'body' && !currentNode.getAttribute('data-action')) {
      console.log(currentNode.tagName.toLowerCase());
      currentNode = currentNode.parentNode
    };

    return currentNode && currentNode.getAttribute('data-action') || '';
  }

  emitFromWebComponent = (type, detail = {}) => {
    const event = new CustomEvent(`event-emitter:${type}`, {
      bubbles: true,
      cancelable: true,
      detail
    });

    return this.dispatchEvent(event);
  }

  backButton = '<div class="back-button" data-action="content:navigate:back"><div>&#9001;</div></div>';
  markup = '<div style="background:#eee;width:20em;border:1px solid #333;border-radius:4px"><div>'+this.backButton+'</div> <h4><slot name="headline">Here is my element</slot></h4><div style="width:200px;height:200px;border:1px solid #333;background:#ab2"><slot name="content"></slot></div><button data-action="do-something">Outside slot</button><footer>Here is some footer</footer></div>'
  css = "<style>.back-button > div { text-indent:-5px;width: 1em;height:1em;margin:5px;background: #afafaf;display: inline-block;border-radius: 50%;border:1px solid #555;padding: 5px 8px 10px;cursor:pointer }</style>"
}

customElements.define('event-emission', EventEmission);
