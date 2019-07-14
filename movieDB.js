var mongoose = require('mongoose');
var movieSchema = new mongoose.Schema({
    title: String,
    year: String,
    type: String
})

var movie = mongoose.model('movie', movieSchema , 'movies');
module.exports = movie;
