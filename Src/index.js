var worker = new Worker('./databaseWorker.js');
  
worker.onmessage = function(event){
  console.log("Database worker process is ", event.data);  worker.terminate(); 
  
  document.querySelector("h1").innerHTML = (event.data);
  //console.log("worker is done working ");
};worker.onerror = function (event){
  console.error(event.message, event);
};

