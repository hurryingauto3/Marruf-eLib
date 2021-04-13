// Modules to control application life and create native browser window
// import {Database} from './databaseInit.js';
let Database = require('./databaseInit');
let MaarufDB = new Database('MaarufDB');
const electron = require('electron')
const url = require('url')
const path = require('path');
const { Menu } = require('electron');
const fs = require('fs');
const glob = require('glob')
const {app, BrowserWindow, dialog} = electron;

function makeSingleInstance () {
  if (process.mas) return

  app.requestSingleInstanceLock()

  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}
// Require each JS file in the main-process dir
function loadDemos () {
  const files = glob.sync(path.join(__dirname, 'main_process/**/*.js'))
  files.forEach((file) => { require(file) })
}

let mainWindow; 
//App Init Function
function initialize () {
  makeSingleInstance()

  loadDemos()

  function createWindow () {
    const windowOptions = {
      width: 1080,
      minWidth: 680,
      height: 840,
      title: app.getName(),
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        nodeIntegrationInWorker: true
      }
    }

    mainWindow = new BrowserWindow(windowOptions)
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'pages/index.html'),
      protocol: 'file:',
      slashes: true
    }));

    // Launch fullscreen with DevTools open, usage: npm run debug
    // if (debug) {
    //   mainWindow.webContents.openDevTools()
    //   mainWindow.maximize()
    //   require('devtron').install()
    // }

    //build menu from template
    const mainMenu = Menu.buildFromTemplate((mainMenuTemplate));
    //Insert menu into app
    Menu.setApplicationMenu(mainMenu);;

    mainWindow.on('closed', () => {
      mainWindow = null
    })
  }

  app.on('ready', () => { 
    createWindow()
    
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow()
    }
  })
}
//App init called
initialize();

//Handle Add Book
function getFileFromUser() {
  var file = dialog.showOpenDialog({
    properties: ['openFile']
  });
  var filestring
  file.then(data => {
    // console.log(data);
    filestring = data.filePaths;
    // console.log(filestring);
    MaarufDB.addBook(new Date(), filestring);
    console.log("book added")
  })
  // return filestring; //Not working for return 
  
};

//Handle Add Directory
function getDirFromUser (){
  var file = dialog.showOpenDialog({
    properties: ['openDirectory'],    
  });
  
  file.then(data => {
    // console.log(data);
    // console.log(filestring);
    searchRecursive(data.filePaths[0], '.pdf');
  })

  

};

//Recusively search folders for PDFs
function searchRecursive(dir, pattern) {
  // This is where we store pattern matches of all files inside the directory
  var results = [];

  // Read contents of directory
  fs.readdirSync(dir).forEach(function (dirInner) {
    // Obtain absolute path
    dirInner = path.resolve(dir, dirInner);

    // Get stats to determine if path is a directory or a file
    var stat = fs.statSync(dirInner);

    // If path is a directory, scan it and combine results
    if (stat.isDirectory()) {
      results = results.concat(searchRecursive(dirInner, pattern));
    }

    // If path is a file and ends with pattern then push it onto results
    if (stat.isFile() && dirInner.endsWith(pattern)) {
      results.push(dirInner);

    }
    
  });
  
  var myJsonString = JSON.stringify(results);
  writeJSON(myJsonString);
  return results;
};

//Writes cotents of any JS object to JSON
function writeJSON(jsonString){
  fs.writeFile('./books.json', jsonString, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Successfully wrote file')
    }
})
};

//Opens pdf file in native viewer // Work Pending
var openPDF = () => {
    // When the button is clicked, open the native file picker to select a PDF.
    dialog.showOpenDialog({
      properties: ['openFile'], // set to use openFileDialog
      filters: [ { name: "PDFs", extensions: ['pdf'] } ] // limit the picker to just pdfs
    }, (filepaths) => {
  
      // Since we only allow one file, just use the first one
      const filePath = filepaths[0];
  
      const viewerEle = document.getElementById('viewer');
      viewerEle.innerHTML = ''; // destroy the old instance of PDF.js (if it exists)
  
      // Create an iframe that points to our PDF.js viewer, and tell PDF.js to open the file that was selected from the file picker.
      const iframe = document.createElement('iframe');
      iframe.src = path.resolve(__dirname, `../public/pdfjs/web/viewer.html?file=${filePath}`);
  
      // Add the iframe to our UI.
      viewerEle.appendChild(iframe);
    })
};

//Menu Items
const mainMenuTemplate = [
  {
    label: 'File', 
    submenu: [
      {
        label: 'Add Book',
        accelerator: 'Ctrl+O',
        click(){
          getFileFromUser();
        }
      }, 
      {
        label: 'Add Directory',
        accelerator: 'Ctrl+D',
        click(){
          directory = getDirFromUser();
          // console.log(type(directory))
          
        }
      },
      {
        label: 'New Collection'
      },
      {
        label: 'Open Book in Reader',
        click(){
          openPDF();
        }
      },
      {
        label: 'Quit',
        accelerator: 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  },

  {
    label: "View",
    submenu: [
      {
        label: "Reload",
        accelerator: "F5",
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            // on reload, start fresh and close any old
            // open secondary windows
            if (focusedWindow.id === 1) {
              BrowserWindow.getAllWindows().forEach(win => {
                if (win.id > 1) win.close();
              });
            }
            focusedWindow.reload();
          }
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: (() => {
          if (process.platform === 'darwin') {
            return 'Alt+Command+I'
          } else {
            return 'Ctrl+Shift+I'
          }
        })(),
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.toggleDevTools()
          }
        }
      }
    ]
  }
]