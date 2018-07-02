'use strict';
const MongoClient = require('mongodb').MongoClient;
const config = require('../config.js')
let db = {};

exports.list = (req, res) => {
  MongoClient.connect(config.cloudDatabase.host)
    .then((client) => {
      console.log('Connected to rf-mongo fro GET call.');
      db = client.db('rf-mongo')
    })
    .then(() => {
      db.collection('movies').find().toArray((err, results) => {
        if (err) {
          return err;
        } else {
          res.render('movies.ejs', { page_title: 'Movies', data: results });
        }
      })
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.add = (req, res) => {
  res.render('add_movie.ejs', {
    page_title: 'Add Movie'
  });
  let movieObject = {
    title: req.body.title,
    format: req.body.formatPicker,
    length: req.body.length,
    release_year: req.body.release_year,
    rating: req.body.rating,
    lastUpdatedDate: new Date()
  };

  MongoClient.connect(config.cloudDatabase.host)
    .then((client) => {
      console.log('Connected to rf-mongo for POST-ADD');
      db = client.db('rf-mongo')
    })
    .then(() => {
      if (movieObject.title !== undefined) {
        db.collection('movies').save(movieObject)
          .then(() => {
            console.log(`Saved ${JSON.stringify(movieObject)} to database.`);
          })
          .catch((err) => {
            throw new Error(err);
          });
      }
    })
    .catch((e) => {
      console.log(e);
    });
}

exports.edit_get = (req, res) => {
  MongoClient.connect(config.cloudDatabase.host)
    .then((client) => {
      console.log('Connected to rf-mongo for POST-GET');
      db = client.db('rf-mongo')
    })
    .then(() => {
      db.collection('movies').find({ title: req.params.title }).toArray()
        .then((resultsToUpdate) => {
          res.render('edit_movie.ejs', {
            page_title: 'Edit Movie', data: resultsToUpdate
          })
        })
        .catch((err) => {
          throw new Error(`Unable to retrieve record due to ${err}.`);
        })
    })
    .catch((e) => {
      console.log(e);
    })

}

exports.edit_post = (req, res) => {
  MongoClient.connect(config.cloudDatabase.host)
    .then((client) => {
      console.log('Connected to rf-mongo for POST-EDIT call.');
      db = client.db('rf-mongo')
    })
    .then(() => {
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
      ).then(() => {
        console.log(`Record updated with success!`);
        db.collection('movies').find().toArray((err, results) => {
          if (err) {
            return err;
          } else {
            res.render('movies.ejs', { page_title: 'Movies', data: results });
          }
        })
      }).catch((err) => {
        throw new Error(err);
      });
    })
}

exports.delete = (req, res)=>{
  MongoClient.connect(config.cloudDatabase.host)
  .then((client) => {
    console.log('Connected to rf-mongo for DELETE call.');
    db = client.db('rf-mongo')
  })
  .then(()=>{
    return db.collection('movies').findOneAndDelete({ name: req.body.title }).then(() => {
      console.log(`Record deleted with success!`);
    })
    .then(()=>{
     return db.collection('movies').find().toArray((err, results) => {
        if (err) {
          return err;
        } else {
          res.render('movies.ejs', { page_title: 'Movies', data: results });
        }
      })
    })
    .catch((err) => {
      throw new Error(err);
    });
  })
  .catch((e)=>{
   console.log(e);
  });
}

