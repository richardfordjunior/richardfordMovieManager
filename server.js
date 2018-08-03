'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const config = require('./config');
const routeConfig = require('./routerConfig/routes');

app.use(express.static('public'));

const cors = require('cors')

var corsOptions = {
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

app.use(cors(corsOptions))
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.get('/',routeConfig.login);
app.get('/home',routeConfig.home);
app.get('/movies',routeConfig.list);
app.use('/add',routeConfig.add);
app.get('/edit/:_id',routeConfig.edit_get);
app.post('/edit/:_id',routeConfig.edit_post);
app.use('/delete/:_id',routeConfig.delete);
app.get('/getAllMovies',routeConfig.getAllMovies);

process.on('unhandledRejection',(err) =>{
  console.log(err);
  process.exit(1);
})

const init = async ()=> {
 await app.listen(config.server.port, () => {
    console.log(`Server listening on port ${config.server.port} at ${new Date()}!!!`);
  });
}

init();
