
var config = {
  database: {
    host: 'localhost',
    user: 'root',
    password: 'rootuser',
    port: 3306,
    db: 'my_db'
  },
  cloudDatabase: {
    host: 'mongodb://root:rootuser1@ds123181.mlab.com:23181/rf-mongo'
  },
  server: {
    host: '127.0.0.1',
    port: '8000'
  }
}

module.exports = config