const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const app = express();
const config = require('./config').server;
const crud = require('./crudOperations');
const _ = require('lodash');
let db;



app.use(express.static('public'));

const cors = require('cors')

var corsOptions = {
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

app.use(cors(corsOptions))
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.set('view engine', 'ejs');


app.get('/', function (req, res) {
  db.collection('movies').find().toArray((err, results) => {
    if (err) {
      return err;
    } else {
      res.render('movies.ejs', { page_title: 'Movies', data: results });
    }
  })
});


app.use('/add', (req, res) => {
  res.render('add_movie.ejs', {
    page_title: 'Add Movie'
  });
  let movieObject = {
    title: req.body.title,
    format: req.body.format,
    length: req.body.length,
    release_year: req.body.release_year,
    rating: req.body.rating,
    lastUpdatedDate: new Date()
  };
  
   if(movieObject.title.length > 0){
    db.collection('movies').save(movieObject)
      .then(() => {
        console.log(`Saved ${JSON.stringify(movieObject)} to database.`);
        //res.redirect('/');
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

})

app.get('/edit/:title', (req, res) => {
 db.collection('movies').find({ title: req.params.title }).toArray()
    .then((resultsToUpdate) => {
      res.render('edit_movie.ejs', {
        page_title: 'Edit Movie', data: resultsToUpdate
      })
    })
    .catch((err) => {
      throw new Error(`Unable to retrieve record due to ${err}.`);
    })
});

app.use('/edit/:title', (req, res)=>{
  db.collection('movies').update(
    { title: req.body.title },
    {
      $set: {
        title: req.body.title,
        format: req.body.format,
        length: req.body.length,
        release_year: req.body.release_year,
        rating: req.body.rating,
        lastUpdatedDate: new Date()
      }
    }
  ).then(()=>{
     console.log(`Record updated with success!`);
  }).catch((err)=>{
    throw new Error(err);
    });
})

app.delete('/delete/:title', (req, res) => {
  console.log(req.body)
  db.collection('movies').findOneAndDelete({ name: req.body.title },
    (err, result) => {
      if (err) {
        res.send(500, err);
      }
      res.send({ message: `Deleted ${req.body.title}` });
    })
})


MongoClient.connect('mongodb://root:rootuser1@ds123181.mlab.com:23181/rf-mongo', (err, client) => {
  if (err) {
    return console.log(err)
  }
  console.log('Connected to rf-mongo');
  db = client.db('rf-mongo')
  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port} at ${new Date()}!!!`);
  });
});