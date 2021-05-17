// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const { dialog } = require("electron").remote;
const path = require("path");
const fs = require("fs");

const viewerElement = document.getElementById("viewer");

// const openFileBtn = document.getElementById("open");
// const saveFileBtn = document.getElementById("save");

// var worker = new Worker('./databaseWorker.js');

// worker.onmessage = function(event){
//   console.log("Database worker process is ", event.data);  worker.terminate(); 
  
//   document.querySelector("h1").innerHTML = (event.data);
//   //console.log("worker is done working ");
// };worker.onerror = function (event){
//   console.error(event.message, event);
// };

WebViewer(
  {
    path: "./public/lib",
    // initialDoc: "./public/files/webviewer-demo-annotated.pdf",
  },
  viewerElement
).then((instance) => {
  // Interact with APIs here.
  // See https://www.pdftron.com/documentation/web for more info
  instance.setTheme("dark");
  instance.disableElements(['downloadButton']);

  const { docViewer, annotManager } = instance;

  function openPDF(){

    fetch('openpdf.json')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        instance.loadDocument(data);
    })
    .catch(function (err) {
        console.log('error: ' + err);
    });

 
  };
  
  openPDF();

});
