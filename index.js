const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const { insertRowAsStream, loadData } = require('./bigquery');
const { hubMessage } = require('./message');

const app = express();
const port = 8000;
const DATASET_ID = 'raft_suite',
  TABLE_ID = 'record';

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Acces-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app
  .route('/')
  .get(function (req, res) {
    const message = JSON.stringify(hubMessage(), null, 2);
    const response = `This is a example message:\n${message}`;
    res.status(200).send(response);
    loadData(message, DATASET_ID, TABLE_ID);
    console.log(message);
  })
  .post(function (req, res) {
    try {
      if (!req.body) throw new Error('No body found on the request');
      console.log(req.body);
      let body = JSON.parse(req.body);

      let required_keys = ['module', 'spec', 'deploy'];
      let keyNotInObject = (key) => !body.hasOwnProperty(key);
      required_keys = required_keys.filter(keyNotInObject);
      if (required_keys.length > 0) throw new Error(`Missing required keys: ${required_keys.join(', ')}`);

      const data = hubMessage(body);
      res.status(200).send(data.jobId);
      console.log(JSON.stringify(data));
    } catch (error) {
      res.status(400).send(error.toString());
      console.error(error);
    }
  });

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});

exports.app = functions.https.onRequest(app);
