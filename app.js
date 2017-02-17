const express = require('express');
const app = express();
const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'test_analytics' });
var bodyParser = require('body-parser');

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({
  extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

app.get('/', (req, res) => {
  const query = 'SELECT name, email FROM users WHERE email = ?';
  client.execute(query, ['test@gmail.com'])
    .then(result => res.json(result))
    .catch(err => {
      console.log(err);
    });
});

app.post('/insert', (req, res) => {
  parseInt(req.body.age);
  const query = 'insert into users(name, email, age) values(?, ?, ?)';
  client.execute(query, [req.body.name, req.body.email, req.body.age], { prepare: true }).
    then(result => {
      res.send('User pushed successfully');
    })
    .catch(err => {
      console.log('err is');
      console.log(err);
    });
});

app.post('/authentication', (req, res) => {
  const query = 'select * from credentials where app_name = ? and api_key = ? ALLOW FILTERING';
  client.execute(query, [req.body.appName, req.body.apiKey], { prepare: true })
    .then(result => {
      if (result.rows.length === 0) {
        res.status(401);
        res.send('Unauthorized User');
      } else {
        res.status(200);
        res.send('Valid User');
      }
    });
});

app.post('/events', (req, res) => {
  const query = 'insert into events(event_name, creation_time) values(?,?)';
  client.execute(query, [req.body.eventName, new Date()], { prepare: true })
    .then(result => {
      res.status(200);
      res.send('Successfully pushed event');
    })
    .catch(err => {
      console.log(err);
    });
});

app.post('/pageViewsTrack', (req, res) => {
  const query = 'select page_views from pageview where org_name=?';
  client.execute(query, [req.body.orgName], { prepare: true })
    .then(result => {
      if (result.rows.length === 0) {
        res.status(401);
        res.send('Invalid org name');
      } else {
        const updateQuery = 'update pageview set page_views = ? where org_name = ?';
        client.execute(query, [result.rows[0].page_views + 1, req.body.orgName], { prepare: true })
          .then(() => {
            res.status(200);
            res.send('Successfully updated page views');
          });
      }
    });
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

