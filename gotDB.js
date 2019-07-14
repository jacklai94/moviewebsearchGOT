var mongoose = require('mongoose');
var gotSchema = new mongoose.Schema({
    name: String,
    isbn: String,
    country: String
})

var book = mongoose.model('book', gotSchema , 'bookCollections');
module.exports = book;
