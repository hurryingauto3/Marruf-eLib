// Initialize Database with dexie 

var Dexie = require('dexie');
var MaarufDB = new Dexie("dexieDB");

MaarufDB.version(1).stores({
    Books: '++b_id, isbn, title, author, date_added, directory, filename, collection',
    Collection: '++c_id, c_name, date_created, books_in_c',
    Logs: '++log_id, book_id, opened_at'
})

MaarufDB.open().catch(function(error) {
    console.error("ERROR: " + error);
});

module.exports = {
    MaarufDB
}

