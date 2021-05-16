var worker = new Worker('./databaseWorker.js');
  
worker.onmessage = function(event){
  console.log("Database worker process is ", event.data);  worker.terminate(); 
  
  document.querySelector("h1").innerHTML = (event.data);
  //console.log("worker is done working ");
};worker.onerror = function (event){
  console.error(event.message, event);
};

var data; 

fetch('books.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    appendData(data);
  })
  .catch(function (err) {
    console.log(err);
  });

  function appendData(data) {
    var mainContainer = document.getElementById("mybooks");
    for (var i = 0; i < data.length; i++) {
      var div = document.createElement("div");
      div.innerHTML = 'Name: ' + data[i]
      console.log(div.innerHTML = 'Name: ' + data[i])
      mainContainer.appendChild(div);

    }
  }

  appendData(data)
