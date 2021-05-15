const {MaarufDB} = require('./databaseInit.js');

var addedRecords = 0;


MaarufDB.transaction('rw', MaarufDB.Books, async () => {
    await MaarufDB.Books.add({
        name: 'hello'
    }).then(function() {
        addedRecords++;
    }).catch(function (e) {
        console.log(e.message);
    })
}).then(function () {
    console.log('what what');
});