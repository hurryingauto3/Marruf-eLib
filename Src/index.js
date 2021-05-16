var worker = new Worker('./databaseWorker.js');
  
worker.onmessage = function(event){
  console.log("Database worker process is ", event.data);  worker.terminate(); 
  
  document.querySelector("h1").innerHTML = (event.data);
  //console.log("worker is done working ");
};worker.onerror = function (event){
  console.error(event.message, event);
};

function creatediv(data_) {
  var html = "";
  html += '<button><div class="image"> <img src="./assets/imgs/file.png" alt="pdf" width="60" height="60"><div class="text">'+data_+'</div></div></button>';
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
  var div = document.createElement("div");
  var html = ""
  for (var i = 0; i < data.length; i++) {
      data_ = data[i];
      html += creatediv(data_);
  
}
html = '<div class="container">' + html + '</div>'
html = '<main id="main">' + html + '</main>'
div.innerHTML = html;
mainContainer.appendChild(div);
}
