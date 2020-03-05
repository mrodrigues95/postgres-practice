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
app.get('/persons', (req, res) => {
  const client = new Client({
    connectionString: connectionString,
  });

  client.connect()
    .then(() => {
      return client.query('SELECT * FROM person;');
    })
    .then((results) => {
      console.log('results', results);
      res.render('person-list', results); // refers to html page (person-list.mustache)
    })
    .catch((e) => {
      console.log('e', e);
    })
    .finally(() => {
      client.end();
    });
});

app.get('/person/add', (req, res) => {
  res.render('person-form'); // refers to html page (person-form.mustache)
});

// handle POST requests
app.post('/person/add', (req, res) => {
  console.log('post body', req.body);

  // connect to DB
  const client = new Client({
    connectionString: connectionString,
  });

  client.connect()
    .then(() => {
      console.log('Connection to database successful');
      // query
      const sql = 'INSERT INTO person (first_name, last_name, email) VALUES ($1, $2, $3);';
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

app.post('/person/delete/:id', (req, res) => {
  console.log('deleting id: ', req.params.id);

    // connect to DB
    const client = new Client({
      connectionString: connectionString,
    });
    client.connect()
      .then(() => {
        const sql = 'DELETE FROM person WHERE person_id = $1;'
        const params = [req.params.id];
        return client.query(sql, params);
      })
      .then(() => {
        console.log('delete results ', results);
        res.redirect('/persons');
      })
      .catch((e) => {
        console.log('e', e);
        res.redirect('/persons');
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
