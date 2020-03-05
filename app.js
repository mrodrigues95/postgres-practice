// dependacies
const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
require('dotenv').config();

const app = express();
const connectionString = 'postgresql://postgres:admin@192.168.1.12:5432/sampledb'

//setup mustache
const mustache = mustacheExpress();
mustache.cache = null;
app.engine('mustache', mustache);
app.set('view engine', 'mustache');

// configure middleware as callback function
app.use(express.static(__dirname + '/www'));
app.use(bodyParser.urlencoded({ extended: false }));

// handle GET requests
app.get('/person-list', (req, res) => {
  res.render('person-list'); // refers to html page (person-list.mustache)
});

app.get('/person/add', (req, res) => {
  res.render('person-form'); // refers to html page (person-form.mustache)
});

// handle POST requests
app.post('/person/add', (req, res) => {
  console.log('post body', req.body);

  // connect to DB
  // const client = new Client({
  //   user: "postgres",
  //   password: "admin",
  //   host: "192.168.1.12",
  //   port: 5432,
  //   database: "sampledb"
  // });
  const client = new Client({
    connectionString: connectionString,
  })
  client.connect()
    .then(() => {
      console.log('Connection to database successful');
      // query
      const sql = 'INSERT INTO person (first_name, last_name, email) VALUES ($1, $2, $3)';
      const params = [req.body.firstName,  req.body.lastName, req.body.email];
      return client.query(sql, params);
    })
    .then((result) => {
      console.log('result?', result);
      res.redirect('/person-list');
    })
    .catch((e) => {
      console.log('e', e);
    })
    .finally(() => {
      client.end();
    });
});

// start server
const port = process.env.PORT || 3000;

app.listen(port, function(error) {
  if (error) {
    console.log('ERROR: ', error);
  } else {
    console.log('Listening on ', port);
  }
});
