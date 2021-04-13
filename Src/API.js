function api(){//Handle Add Book
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
}

module.exports = api;

