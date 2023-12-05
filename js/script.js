const ipcRenderer = require('electron').ipcRenderer;

const serverBtn   = document.querySelector('.server-ctrl__btn');
const btnClose    = document.querySelector('.window-ctrl__btn--close');
const btnMin      = document.querySelector('.window-ctrl__btn--min');
const receipt     = document.querySelector('.prntr__input--receipt');
const barcode     = document.querySelector('.prntr__input--barcode');

document.onkeydown = (key) => {
  if(key.code == 'Space')
  {
    if(serverBtn.classList.contains('server-ctrl__btn--stop'))
      serverBtn.classList.add('server-ctrl__btn--stop-active');
    else if(serverBtn.classList.contains('server-ctrl__btn--pend'))
      serverBtn.classList.add('server-ctrl__btn--pend-active');
    else if(serverBtn.classList.contains('server-ctrl__btn--run'))
      serverBtn.classList.add('server-ctrl__btn--run-active');
  }
};

document.onkeyup = (key) => {
  if(key.code == 'Space')
  {
    if(serverBtn.classList.contains('server-ctrl__btn--stop'))
      serverBtn.classList.remove('server-ctrl__btn--stop-active');
    else if(serverBtn.classList.contains('server-ctrl__btn--pend'))
      serverBtn.classList.remove('server-ctrl__btn--pend-active');
    else if(serverBtn.classList.contains('server-ctrl__btn--run'))
      serverBtn.classList.remove('server-ctrl__btn--run-active');

    serverBtn.classList.remove('server-ctrl__btn--stop', 'server-ctrl__btn--run');
    serverBtn.classList.add('server-ctrl__btn--pend');

    serverBtn.click();
  }
};

serverBtn.onmouseup = () => {
  serverBtn.classList.remove('server-ctrl__btn--stop', 'server-ctrl__btn--run');
  serverBtn.classList.add('server-ctrl__btn--pend');
};

// Assign Handlers
ipcRenderer.on('server:start', function() {
  serverBtn.classList.remove('server-ctrl__btn--stop', 'server-ctrl__btn--pend');
  serverBtn.classList.add('server-ctrl__btn--run');
});

ipcRenderer.on('server:stop', function() {
  serverBtn.classList.remove('server-ctrl__btn--run', 'server-ctrl__btn--pend');
  serverBtn.classList.add('server-ctrl__btn--stop');
});

serverBtn.onclick = () => {
  ipcRenderer.send('server:toggle');
}

btnClose.onclick = () => {
  ipcRenderer.send('window:close');
};

btnMin.onclick = () => {
  ipcRenderer.send('window:min');
};

