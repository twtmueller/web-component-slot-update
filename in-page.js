document.getElementById("trial-1")
  .addEventListener('tpl:replaceFirst', e => {
    console.log('change slot event received', e, this);
    const contentElement = e.target;
    const newContent = document.createElement('div');
    newContent.innerHTML = `<p>Changed the content now to something else without a button</p>`;
    contentElement.appendChild(newContent);
  });

const populateSecond  = () => {
  const contentElement = document.getElementById("emission-wc2");
  contentElement.innerHTML = '<h2 slot="content">Original stuff from JS</h2>'
}

const replaceSecond  = () => {
  const contentElement = document.getElementById("emission-wc2");
  contentElement.innerHTML = '<h2 slot="headline">Let\'s change the headline as well</h2><p slot="content">Lorem ipsum mes indicatis substantiative</p>'
}

const switchContent = () => {
  document.getElementById('emission-wc3').innerHTML = '<div slot="content"><strong>It Worked!!!</strong></div>'
}

const generateNodeWithNumber = randomNumber => {
  const counterNode = document.createElement('p');
  counterNode.innerText = randomNumber;
  console.log('cC', counterNode);
  return counterNode;
}

document.getElementById('emission-wc3').addEventListener('event-emitter:innerClick', e => {
  const currentContentNode = document.getElementById('emission-wc3').firstChild;
  const newNode = generateNodeWithNumber(e.detail.count);
  currentContentNode.appendChild(newNode);
});

window.onload = () => {
  document.getElementById('emission-wc3').innerHTML = '<div slot="content"><h2>Headline here</h2><button onclick="switchContent()">Replace me</button></div>';
}