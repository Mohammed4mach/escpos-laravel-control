// Modules to control application life and create native browser window
const { app, BrowserWindow, Tray, nativeImage, ipcMain  } = require('electron')
const path = require('node:path')

function createWindow() {
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
}

function assignHandlers()
{

}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit()
})

