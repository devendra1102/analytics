const express = require('express');
const app = express();
const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'test' });
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
      console.log('User pushed successfully');
    })
    .catch(err => {
      console.log('err is');
      console.log(err);
    });
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

