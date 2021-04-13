// // Initialize Database with dexie 

// var Dexie = require('dexie');
// var MaarufDB = new Dexie("dexieDB");

// MaarufDB.version(1).stores({
//     Books: '++b_id, isbn, title, author, date_added, directory, filename, collection',
//     Collection: '++c_id, c_name, date_created, books_in_c',
//     Logs: '++log_id, book_id, opened_at'
// })

// MaarufDB.open().catch(function(error) {
//     console.error("ERROR: " + error);
// });

// module.exports = {
//     MaarufDB
// }

let { Dexie } = require('dexie');

class Database extends Dexie {
    constructor() {
        super('MaarufDB');

        this.version(1).stores({
            Books: '++b_id, isbn, title, author, date_added, directory, filename, collection',
            Collection: '++c_id, c_name, date_created, books_in_c',
            Logs: '++log_id, book_id, opened_at'
        });

        this.Books = this.table('Books');
        this.Collection = this.table('Collection');
        this.Logs = this.table('Logs');
    }

    // ADD methods 

    addBook(m_date_added, m_directory, m_collection = null) {
        return this.Books.add({
            // isbn: m_isbn, 
            // title: m_title,
            // author: m_author, 
            date_added: m_date_added,
            directory: m_directory,
            // filename: m_filename,
            // collection: m_collection
        });
    }

    addCollection(col_name, createDate, booksInCol = null) {
        return this.Collection.add({
            c_name: col_name,
            date_created: createDate,
            books_in_c: booksInCol
        });
    }

    addLog(bookId) {
        return this.Logs.add({
            book_id: bookId,
            opened_at: Date()
        })
    }

    // DELETE methods 
    deleteBook(bookID) {
        return this.Books.delete(bookID);
    }

    deleteCollection(collectionID) {
        return this.Collection.delete(collectionID);
    }
    
    // CLEAR LOG HISTORY 
    clearLogs() {
        return this.Logs.clear();
    }

    // GET methods  
    // TODO: 
    // - get all books 
    // - get all collections 
    // 


    // Update Metadata methods (Later)
}

module.exports = Database;
