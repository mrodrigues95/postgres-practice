// dependacies
const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
require('dotenv').config();

const app = express();
const connectionString =
  'postgresql://postgres:admin@192.168.1.12:5432/sampledb';

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
    connectionString: connectionString
  });

  client
    .connect()
    .then(() => {
      return client.query('SELECT * FROM person;');
    })
    .then(results => {
      res.render('person-list', {
        persons: results.rows
      }); // refers to html page (person-list.mustache)
    })
    .catch(e => {
      console.log('e', e);
    })
    .finally(() => {
      client.end();
    });
});

app.get('/person/add', (req, res) => {
  res.render('person-form'); // refers to html page (person-form.mustache)
});

app.get('/person/edit/:id', (req, res) => {
  // connect to DB
  const client = new Client({
    connectionString: connectionString
  });
  client
    .connect()
    .then(() => {
      const sql = 'SELECT * FROM person WHERE person_id = $1;';
      const params = [req.params.id];
      return client.query(sql, params);
    })
    .then(results => {
      // if no results, redirect
      if (results.rowCount === 0) {
        res.redirect('/persons');
        return;
      }
      //console.log('results?', results);
      res.render('person-edit', {
        person: results.rows[0]
      });
    })
    .catch(e => {
      console.log('edit get e', e);
      res.redirect('/persons');
    })
    .finally(() => {
      client.end();
    });
});

// handle POST requests
app.post('/person/add', (req, res) => {
  console.log('post body', req.body);

  // connect to DB
  const client = new Client({
    connectionString: connectionString
  });

  client
    .connect()
    .then(() => {
      console.log('Connection to database successful');
      // query
      const sql =
        'INSERT INTO person (first_name, last_name, email) VALUES ($1, $2, $3);';
      const params = [req.body.firstName, req.body.lastName, req.body.email];
      return client.query(sql, params);
    })
    .then(result => {
      console.log('result?', result);
      res.redirect('/persons');
    })
    .catch(e => {
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
    connectionString: connectionString
  });
  client
    .connect()
    .then(() => {
      const sql = 'DELETE FROM person WHERE person_id = $1;';
      const params = [req.params.id];
      return client.query(sql, params);
    })
    .then(() => {
      console.log('delete results ', results);
      res.redirect('/persons');
    })
    .catch(e => {
      console.log('e', e);
      res.redirect('/persons');
    })
    .finally(() => {
      client.end();
    });
});

app.post('/person/edit/:id', (req, res) => {
  console.log('updating person ', req.params.id);

  // connect to DB
  const client = new Client({
    connectionString: connectionString
  });

  client.connect()
    .then(() => {
      const sql = 'UPDATE person SET first_name = $1, last_name = $2, email = $3 WHERE person_id = $4;'
      const params = [req.body.firstName, req.body.lastName, req.body.email, req.params.id];

      return client.query(sql, params);
    })
    .then((results) => {
      console.log('update results ', results);
      res.redirect('/persons');
    })
    .catch((e) => {
      console.log('update err ', e);
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
