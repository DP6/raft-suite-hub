const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const { insertRowAsStream } = require('./bigquery');
const cuid = require('cuid');

const app = express();
const port = 8000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Acces-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(cors());

const dimensions = {
  "00": "Não há ocorrências",
  "01": "Erro de disponibilidade",
  "02": "Erro de tempestividade",
  "03": "Erro de completude",
  "04": "Erro de quantidade",
  "05": "Erro de validade",
  "06": "Erro de consistencia",
  "07": "Erro de acurácia",
  "08": "Erro de uniformidade",
  "09": "Erro de acessibilidade",
  "10": "Erro de segurança"
}

/**
 * 
 * @param {string} [project=GCP Project] - Name of the project. 
 * @param {string} module - Name of the module that sent the message.
 * @param {string} spec - Division of the module 
 * @param {number} deploy - Module or Cloud Function version
 * @param {string} [code="00-00"] - Status code, will be used to get the message.
 * @param {string} [description] - Description of the status
 * @param {string} [details] - JSON field with details and specific log to explain the status
 * @param {Object} [payload] - JSON payload that will be passed without changing the table structure
 * @returns {Object} - Structured message.
 */
function hubMessage(project = process.env.GCLOUD_PROJECT, module = "none", spec = "", deploy = 1, code = "00-00", description = "", details = "", payload = {}) {
  return {
    timestamp: new Date(),
    jobId: cuid(), //UUID ou CUID talvez? ou algo mais simples mesmo
    project: project, //cliente/projeto
    module: module, //identificador do módulo que mandou a mensagem
    spec: spec,
    deploy: deploy, //versão atual do módulo ou da cloud function 
    version: "0.0.1", //Versão do hub,
    status: {
      code: code,
      message: dimensions[code.split('-')[0]],
      description: description,
      details: details
    },
    payload: JSON.stringify(payload)
  };
}

app.route('/')
  .get(function (req, res) {
    const message = JSON.stringify(hubMessage(), null, 2);
    const response = `This is a example message:\n${message}`;
    res.status(200).send(response);
    console.log(message);
  })
  .post(function (req, res) {
    try {
      if (!req.body) throw "No body found on the request";
      const body = JSON.parse(req.body);
      let keyNotInObject = (key) => !body.hasOwnProperty(key);
      let required_keys = ['module', 'spec', 'deploy'];
      required_keys = required_keys.filter(keyNotInObject)
      if (required_keys.length > 0)
        throw `Missing required keys: ${required_keys.join(', ')}`;

      let { project, module, spec, deploy, code, description, details, payload } = body;

      const data = hubMessage(project, module, spec, deploy, code, description, details, payload);

      res.status(200).send(data.jobId);
      console.log(JSON.stringify(data));

    } catch (error) {
      console.error(error);
      res.status(206).send(error);
    }
  });

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
})

exports.app = functions.https.onRequest(app);

document = {
  name: "",
  page: "",
  type: "",
  version: "",
  parameters: [{
    key: "",
    value: ""
  }]
}
dataLayer = {
  schema: "",
  status: "",
  objectName: "",
  keyName: ""
}