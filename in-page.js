document.getElementById("trial-1")
  .addEventListener('tpl:replaceFirst', e => {
    const newContent = document.createElement('div');
    newContent.innerHTML = `<p>Changed the content now to something else without a button</p>`;
    e.target.appendChild(newContent);
  });

document.getElementById("trial-1")
  .addEventListener('btnClick:outside-slot', e => {
    const newContent = `<h2>Your new number is: ${generateRandomNumber()}`;
    const container = document.createElement('div');
    container.innerHTML = newContent;
    e.target.appendChild(container);
    console.log('TARGET NODE', e);
  });

const generateRandomNumber = () =>
  Math.trunc(Math.random() * 1000);
