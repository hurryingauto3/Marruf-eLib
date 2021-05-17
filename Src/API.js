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