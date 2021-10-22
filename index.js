const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const { insertRowsAsStream, loadData } = require('./bigquery');
const { hubMessage } = require('./message');

const app = express();
const port = 8000;
const env = process.env;
const DATASET_ID = env.DATASET_ID || 'raft_suite',
  TABLE_ID = env.TABLE_ID || 'hub',
  INSERT_TYPE = env.INSERT_TYPE || 'batch';

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
    let message = hubMessage();
    message = JSON.stringify(message, null, 2);
    const response = `This is a example message:\n${message}`;
    res.status(200).send(response);
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

      if (body instanceof Array)
        const data = body.map(i => hubMessage(i));
      else
        const data = hubMessage(body);
      res.status(200).send(data.jobId);
      console.log(JSON.stringify(data));
      if (INSERT_TYPE == 'stream') insertRowsAsStream(data, DATASET_ID, TABLE_ID);
      else loadData(data, DATASET_ID, TABLE_ID);
    } catch (error) {
      res.status(400).send(error.toString());
      console.error(error);
    }
  });

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});

exports.app = functions.https.onRequest(app);
