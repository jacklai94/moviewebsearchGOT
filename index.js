const path = require('path')
const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express();
const db = "mongodb+srv://Jack:jack1331@cluster0-k2ubh.mongodb.net/Movies?retryWrites=true&w=majority"
const PORT = process.env.PORT || 5000


// Mongodb connection
mongoose.connect(db).then(() => { 
  console.log('connected');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

// LOAD TABLE
app.get('/' ,(req, res)=>{
  var movieDB = require('./movieDB');
  movieDB.find({}).then((response1) => {
    res.render('pages/newMovie', {
      movie : response1
    })
  })
});

// Load GOT
app.get('/got',(req,res)=>{
  var got = require('./gotDB')
  got.find({}).then((response)=>{
    res.render('pages/GOT',{
      book: response
    });
  })
})

// INSERT NEW MOVIE
app.post('/insertNew',(req, res) => {
  const movieDB = require('./movieDB');
  const input = req.body.movieName;
  const querystr1= `http://www.omdbapi.com/?s=${input}&apikey=c0f6eba9`;

  axios.get(querystr1).then((response)=>{
      if(response.data == null){
        console.log('error name');
        res.redirect('/')
      }
      console.log(response.data);
      // insert
      for(var i = 0; i < response.data.Search.length; i++){
        var x = new movieDB({
          title: response.data.Search[i].Title,
          year: response.data.Search[i].Year,
          type: response.data.Search[i].Type
        })
        x.save({}).then(result=>{
          console.log(result);
        })
      }
      console.log('complete');
      res.redirect('/');
  }
  ).catch((error)=>{
    console.log(error);
    res.redirect('/')
  })
});

// INSERT GOT DATA
app.get('/got/insert', (req,res)=>{
  var got = require('./gotDB');
  const querystr2 = "https://www.anapioficeandfire.com/api/books/"
  axios.get(querystr2).then((response)=>{
    console.log(response.data);
    for(var i =0; i< response.data.length; i++){
      var gotBook = new got({
        name: response.data[i].name,
        isbn: response.data[i].isbn,
        country: response.data[i].country
      })
      gotBook.save({}).then((result)=>{
        console.log(result);
      })
    }
    console.log('success');
    res.redirect('/got');
  })
})

// DELETE
app.get('/delete' ,(req,res)=>{
  var movieDB = require('./movieDB');
  movieDB.deleteOne({"_id":req.query.q}).then((result)=>{
    console.log('delete successfully');
    res.redirect('/')
  })
})

// DELETE
app.get('/delete/got' ,(req,res)=>{
  var movieDB = require('./gotDB');
  movieDB.deleteOne({"_id":req.query.q}).then((result)=>{
    console.log('delete successfully');
    res.redirect('/got')
  })
})

app.listen(PORT, () =>{
  console.log(`Listening on ${ PORT }`)
});

