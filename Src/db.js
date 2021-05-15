// const Dexie = require('dexie');

// let db = new Dexie("MaarufDB");

// db.version(1).stores({books: "++id, name"});

// db.transaction('rw', db.books, function*() {
//     if ((yield db.books().where('name').equals('helloworld').count()) == 0) {
//         let id = yield db.books.add({name: 'helloworld'});
//         console.log('yoyo');
//         alert (`Added book with id ${id}`);
//     } 
// }).catch(e => {
//     console.error (e.stack);
// });