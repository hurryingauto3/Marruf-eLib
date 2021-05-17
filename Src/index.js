const remote = require ("electron").remote;
const fs = require('fs');
// var worker = new Worker('./databaseWorker.js');
// worker.onmessage = function(event){
//   console.log("Database worker process is ", event.data);  worker.terminate(); 
//   document.querySelector("h1").innerHTML = (event.data);
//   //console.log("worker is done working ");  
// };worker.onerror = function (event){
//   console.error(event.message, event);
// };

var path; 

function openPDF(){
  fs.writeFile('openpdf.json', JSON.stringify(path), err => {
    if (err) {
      console.log('Error writing file', err)
    } else {
      console.log('Successfully wrote file')
    }
  })
  remote.getCurrentWindow().loadFile('pdf.html');

}

function creatediv(data_) {
  
  var html = "";
  html += '<button onclick = "openPDF()" ><div class="image"> <img src="./assets/imgs/file.png" alt="pdf" width="60" height="60"><div class="text">' +data_+'</div></div></button>';
  return html;
}

fetch('books.json')
  .then(function (response) {
      return response.json();
  })
  .then(function (data) {
      appendData(data);
  })
  .catch(function (err) {
      console.log('error: ' + err);
  });

function appendData(data) {
  var mainContainer = document.getElementById("myData");
  var html = ""
  for (var i = 0; i < data.length; i++) {
      data_ = data[i];
      path = data_.path
      html += creatediv(data_.title);
  
}
  html = '<div class="container">' + html + '</div>'
  html = '<main id="main">' + html + '</main>'
  mainContainer.innerHTML = html;
}

