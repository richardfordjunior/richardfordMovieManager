'use strict';
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const config = require('../config.js')
const _ = require('lodash');
let db = {};
const util = require('../utils/common');

/*
Handle all route request here...
*/

exports.login = (req, res) => {
  res.render('login.ejs',{});
}

exports.home = (req, res) => {
  res.render('index.ejs', {
    page_title: 'Home'
  });
}

exports.getAllMovies = (req, res)=>{
  MongoClient.connect(config.cloudDatabase.host)
    .then((client) => {
      console.log('Connected to rf-mongo for GET call.');
      db = client.db('rf-mongo')
    })
    .then(() => {
      db.collection(config.cloudDatabase.collections.movies).find().toArray((err, results) => {
        if (err) {
          return err;
        } else {
          util.formatMovieLength(results);
          return res.json(results);
        }
      })
    })
}

exports.list = (req, res) => {
  MongoClient.connect(config.cloudDatabase.host)
    .then((client) => {
      console.log('Connected to rf-mongo for GET call.');
      db = client.db('rf-mongo')
    })
    .then(() => {
      db.collection(config.cloudDatabase.collections.movies).find().toArray((err, results) => {
        if (err) {
          return err;
        } else {
          util.formatMovieLength(results);
          res.render('movies.ejs', { page_title: 'Movies', data: results });
        }
      })
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.add = (req, res) => {
  //Populate grid
  let movie = new Movie(req.body.title,req.body.length,req.body.release_year,req.body.rating, req.body.formatPicker);
  
  MongoClient.connect(config.cloudDatabase.host)
    .then((client) => {
      console.log('Connected to rf-mongo for POST-ADD');
      db = client.db('rf-mongo')
      db.collection(config.cloudDatabase.collections.movies).find().toArray((err, results) => {
        if (err) {
          return err;
        } else { 
          //save the object
          if (movie.title !== undefined) {
            return db.collection(config.cloudDatabase.collections.movies).save(movie)
              .then(() => {
                console.log(`Saved ${JSON.stringify(movie)} to database.`);
                db.collection(config.cloudDatabase.collections.movies).find().toArray((err, results) => {
                  if (err) {
                    return err;
                  } else {
                    util.formatMovieLength(results);
                    res.render('movies.ejs', { page_title: 'Movies', data: results });
                    res.end();
                  }
                })
              })
              .catch((err) => {
                throw new Error(err);
              });
          }
        }
      })
    })
}

exports.edit_get = (req, res) => {
  MongoClient.connect(config.cloudDatabase.host)
    .then((client) => {
      console.log('Connected to rf-mongo for POST-GET');
      db = client.db('rf-mongo')
    })
    .then(() => {
      db.collection(config.cloudDatabase.collections.movies).find(ObjectId(req.params._id)).toArray()
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
  return MongoClient.connect(config.cloudDatabase.host)
  .then((client) => {
    console.log('Connected to rf-mongo for POST-EDIT call.');
    db = client.db('rf-mongo')
  })
  .then((record) => {
   db.collection(config.cloudDatabase.collections.movies).update(
      { _id: ObjectId(req.params._id)},
      {
        $set: {
          title: req.body.title,
          format: req.body.formatPicker,
          length: req.body.length,
          release_year: req.body.release_year,
          rating: req.body.rating,
          lastUpdatedDate: new Date()
        }
      }
    ).then((updated) => {
      if(updated.result.nModified===1){
        console.log(`Record updated with success!`);    
        db.collection(config.cloudDatabase.collections.movies).find().toArray((err, results) => {
        if (err) {
          return err;
        } else {
          util.formatMovieLength(results);
          res.render('movies.ejs', { page_title: 'Movies', data: results });
        }
      })
    }
    }).catch((err) => {
      throw new Error(err);
    });
  })
}

exports.delete = (req, res) => {
  MongoClient.connect(config.cloudDatabase.host, { useNewUrlParser: true })
    .then((client) => {
      console.log('Connected to rf-mongo for DELETE call.');
      db = client.db('rf-mongo')
    })
    .then(() => {
      db.collection(config.cloudDatabase.collections.movies).remove({_id: ObjectId(req.params._id)}).then(() => {
          console.log(`Record ${req.params._id} deleted with success!`);
      })
        .then(() => {
          return db.collection(config.cloudDatabase.collections.movies).find().toArray((err, results) => {
            if (err) {
              return err;
            } else {
              util.formatMovieLength(results);
              res.render('movies.ejs', { page_title: 'Movies', data: results });
            }
          })
        })
        .catch((err) => {
          throw new Error(err);
        });
    })
    .catch((e) => {
      console.log(e);
    });
}

class Movie {
  constructor(title,length,release_year,rating,formatPicker){
    this.title = title,
    this.format = formatPicker,
    this.length = length,
    this.release_year = release_year,
    this.rating = rating,
    this.lastUpdatedDate = new Date();
  }
}