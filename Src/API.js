var getFileFromUser = () => {
    const file = dialog.showOpenDialog({
      properties: ['openFile']
    });
  
    if (!file) { return; }
  
    console.log(file);
  };
  
  //Handle Add Directory
var getDirFromUser = () => {
    const files = dialog.showOpenDialog({
      properties: ['openDirectory'], 
  
      
    });
  
    console.log(files)
  };
  
var searchRecursive = function(dir, pattern) {
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
  
      console.log(results)
    });
  
    return results;
  };
  
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
  }