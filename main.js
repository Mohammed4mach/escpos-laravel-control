// Modules to control application life and create native browser window
const { app, BrowserWindow, Tray, nativeImage, ipcMain, session } = require('electron')
const path = require('node:path')
const EscposServer = require('./js/models/EscposServer.cjs')


async function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 380,
    height: 532,
    frame: false,
    resizable: false,
    show: true,
    title: 'EscPos Laravel Control',

    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      allowRunningInsecureContent: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  const iconv = nativeImage.createFromPath(
    path.join(__dirname, "assets/printer-gray.svg")
  )
  // const icon = path.join(__dirname, './assets/printer-color.svg')
  const tray = new Tray(iconv)

  tray.on('click', (event, bounds) => {
    if (mainWindow.isVisible())
      mainWindow.hide()
    else
      mainWindow.show()
  })

  tray.setTitle('EscPos');
  tray.setToolTip('EscPos Laravel Control')

  ipcMain.on('server:toggle', () => EscposServer.toggle(mainWindow));
  ipcMain.on('window:min', () => mainWindow.hide());
  ipcMain.on('window:close', async () => {
    if(EscposServer.runing)
      await EscposServer.stop(mainWindow);

    setTimeout(() => mainWindow.close(), 1000);
  });
}

app.whenReady().then(async () => {
  await createWindow()

  app.on('activate', async function() {
    if (BrowserWindow.getAllWindows().length === 0) await createWindow()
  })

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': '*'
        // [
          // "default-src ''",
          // "script-src 'self'",
          // "script-src-elem 'self'",
          // "style-src-elem 'self'"
        // ]
      }
    })
  })
})

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit()
})

