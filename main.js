const electron = require('electron')
const path = require('path')
const url = require('url')
const os = require('os')
const fs = require('fs')

const app = electron.app
const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain
const dialog = electron.dialog

//require('electron-reload')(__dirname);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
const template = [
  {
    label: 'Options',
    submenu: [
      {
        label:'open',
        click: function(item, focusedWindow){
          const options = {
            title: 'Open JSON Graph',
            filters: [
              {name: 'Graph', extensions: ['json']}
            ]
          }
          dialog.showOpenDialog(options, function(filenames) {
            if (filenames) {
              // not dealing with opening lots of files at this point
              let fn = filenames[0]
              fs.readFile(fn, "utf8", function(err, data){
                if (err) {
                  console.log(err);
                }
                console.log(data);
              })
            }
          })
        }
      },
      {
        label:'save',
        click: function(item, focusedWindow) {
          console.log("WIP");
          // Just save to the same file we already have open
          // If empty then with no previously opened file then just call 'save as'
        }
      },
      {
        label:'save as',
        click: function(item, focusedWindow) {
          const options = {
            title: 'Save to JSON',
            filters: [
              {name: 'Graph', extensions: ['json']}
            ]
          }
          dialog.showSaveDialog(options, function (filename) {
            data = "{\"Hello\":\"world\"}"
            fs.writeFile(filename, data, function (err) {
              if (err) {
                console.log(err);
              } else {
                console.log("Something may have been saved.");
              }
            })
          })
        }
      },
      {type: 'separator'},
      {
        role: 'exit',
        label:'exit',
        click: function () {
          app.quit()
        }
      },
    ]
  },
  {
    label: 'Calculate',
    submenu: [
      {role: 'print-graph', label:'print graph'},
      {role: 'all-values', label:'values'},
    ]
  },
  {
    label: 'View',
    submenu: [
      {role: 'reload'},
      {role: 'forcereload'},
      {role: 'toggledevtools'},
      {type: 'separator'},
      {role: 'resetzoom'},
      {role: 'zoomin'},
      {role: 'zoomout'},
      {type: 'separator'},
      {role: 'togglefullscreen'}
    ]
  },
]

// Classes

// Functions
function createWindow () {
  // Create the browser window.
  // TODO: frame: false
  mainWindow = new BrowserWindow({width: 800, height: 600, show:false, frame:true})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.once('ready-to-show', function() {
    mainWindow.show()
  })
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// App life cycle

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process code. You can also put them in separate files and require them here.

ipc.on('open-file-dialog', function (event) {
  dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory']
  }, function (files) {
    if (files) event.sender.send('selected-directory', files)
  })
})
