
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

module.exports = mainMenuTemplate;