// Modules to control application life and create native browser window

const electron = require('electron')
const url = require('url')
const path = require('path');
const { Menu } = require('electron');
const fs = require('fs');
const glob = require('glob')
const { app, BrowserWindow, dialog } = electron;
const prompt = require('electron-prompt');


var allFiles = [];
var allCollections = [];
var mainWindow;
var currentWindow;

class Book {
  constructor(title, path) {
    this.title = title;
    this.path = path;
  }
}


function createWindow() {
  mainWindow = new BrowserWindow({
    // Create the browser window.
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      nodeIntegrationInWorker: true
    }

  })
  // and load the index.html of the app.
  mainWindow.loadFile("index.html");
  //build menu from template
  const mainMenu = Menu.buildFromTemplate((mainMenuTemplate));
  //Insert menu into app
  Menu.setApplicationMenu(mainMenu);;
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    exitProcedure();
    app.quit();
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
//Handle Add Books
function getFileFromUser() {
  dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: "Documents", extensions: ["pdf"] }
    ]
  }).then(data => {
    // console.log(data);
    var filestring
    filestring = data.filePaths;
    console.log(filestring)
    for (var i = 0; i < filestring.length; i++) {
      newbook = new Book(stringParser(filestring[i]), filestring[i])
      allFiles.push(newbook);
    }
    writeJSON(JSON.stringify(allFiles));
  })


};

function openPDF() {
  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: "Documents", extensions: ["pdf"] }
    ]
  }).then(data => {
    var filestring
    filestring = data.filePaths;
    filestring = JSON.stringify(filestring[0])
    fs.writeFile('openpdf.json', filestring, err => {
      if (err) {
        console.log('Error writing file', err)
      } else {
        console.log('Successfully wrote file')
      }
    })
  })
}


//Handle Add Directory
function getDirFromUser() {
  var file = dialog.showOpenDialog({
    properties: ['openDirectory'],
  });

  file.then(data => {

    searchRecursive(data.filePaths[0], '.pdf');
  })

};

function createCollection() {
  var name
  prompt({
    title: 'New Collection',
    label: 'Name',
    inputAttrs: {
      type: 'input'
    },
    type: 'input'
  })
    .then((name) => {
      if (name === null) {
        console.log('user cancelled');
      } else {
        allCollections.push(name);
        var myJsonString = JSON.stringify(allCollections);
        writeJSON(myJsonString, false);


      }
    })
    .catch(console.error);


}
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
      dirInner = stringParser(dirInner)
      results.push(dirInner);

    }

  });

  var myJsonString = JSON.stringify(results);
  writeJSON(myJsonString);
};

function exitProcedure() {
  var emptyArray = []
  emptyArray = JSON.stringify(emptyArray)
  writeJSON(emptyArray)
  writeJSON(emptyArray, false);

}
function stringParser(filestring) {
  var stringSplit = filestring.split("\\");
  stringSplit = stringSplit[stringSplit.length - 1];
  return stringSplit.split(".pdf")[0]
}
//Writes cotents of any JS object to JSON
function writeJSON(jsonString, books = true) {
  if (books) {
    fs.writeFile('./books.json', jsonString, err => {
      if (err) {
        console.log('Error writing file', err)
      } else {
        console.log('Successfully wrote file')
      }
    })
  }
  else {
    fs.writeFile('./collections.json', jsonString, err => {
      if (err) {
        console.log('Error writing file', err)
      } else {
        console.log('Successfully wrote file')
      }
    })

  }
};
//Menu Items
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Book(s)',
        accelerator: 'Ctrl+O',
        click() {
          getFileFromUser();
        }
      },
      {
        label: 'Add Directory',
        accelerator: 'Ctrl+D',
        click() {
          directory = getDirFromUser();
          // console.log(type(directory))

        }
      },
      {
        label: 'New Collection',
        click() {
          createCollection();
        }
      },
      {
        label: 'Open Book in Reader',
        click() {
          openPDF();
          mainWindow.loadFile("pdf.html")
          currentWindow = "pdf.html"
        }

      },
      {
        label: 'Back',
        click() {
          if (currentWindow == "pdf.html") {
            mainWindow.loadFile("index.html")
            currentWindow = "index.html"
          }
        }
      },

      {
        label: 'Quit',
        accelerator: 'Ctrl+Q',
        click() {
          exitProcedure();
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

