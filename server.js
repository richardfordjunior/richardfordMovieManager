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

app.get('/movies',routeConfig.list);
app.post('/add',routeConfig.add);
app.get('/edit/:title',routeConfig.edit_get);
app.post('/edit/:title',routeConfig.edit_post);
app.use('/delete/:title',routeConfig.delete);

app.listen(config.server.port, () => {
  console.log(`Server listening on port ${config.server.port} at ${new Date()}!!!`);
});
