const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  //remover menu
  mainWindow.setMenu(null);
/*
//personalizar menu
const Menu = electron.Menu;
const template = [
   {
      label: 'Edicao',
      submenu: [
         {
            role: 'undo',
            label: 'Desfazer'
         },
         {
            role: 'redo',
            label: 'Refazer'
         },
         {
            type: 'separator'
         },
         {
            role: 'cut',
            label: 'Recortar'
         },
         {
            role: 'copy',
            label: 'Copiar'
         },
         {
            role: 'paste',
            label: 'Colar'
         }
      ]
   }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
*/

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
