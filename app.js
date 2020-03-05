// dependacies
const express = require('express');
const mustacheExpress = require('mustache-express');
require('dotenv').config();

const app = express();

//setup mustache
const mustache = mustacheExpress();
mustache.cache = null;
app.engine('mustache', mustache);
app.set('view engine', 'mustache');

// configure middleware as callback function
app.use(express.static(__dirname + '/www'));

// handle GET requests
app.get('/person-list', (req, res) => {
  res.render('person-list'); // refers to html page (person-list.mustache)
});

const port = process.env.PORT || 3000;

app.listen(port, function(error) {
  if (error) {
    console.log('ERROR: ', error);
  } else {
    console.log('Listening on ', port);
  }
});
