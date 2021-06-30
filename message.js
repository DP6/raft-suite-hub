const cuid = require('cuid');
const status = require('./status.json');

function getStatusMessage(statusCode) {
  let [dimension, code] = statusCode.split('-');
  dimension = status[dimension];
  code = dimension.codes[code];
  return `${dimension.dimension} - ${code}`;
}

/**
 * @param {object} body - Request body
 * @param {string} [body.project=GCP Project] - Name of the project.
 * @param {string} body.module - Name of the module that sent the message.
 * @param {string} body.spec - Division of the module
 * @param {number} body.deploy - Module or Cloud Function version
 * @param {string} [body.code="00-00"] - Status code, will be used to get the message.
 * @param {string} [body.description] - Description of the status
 * @param {string} [body.details] - JSON field with details and specific log to explain the status
 * @param {Object} [body.payload] - JSON payload that will be passed without changing the table structure
 * @returns {Object} - Structured message.
 */
function hubMessage(body) {
  const project = process.env.GCLOUD_PROJECT || 'DP6';
  const { module, spec, deploy, code, description, details, payload } = {
    module: 'module',
    spec: 'spec',
    deploy: 'beta',
    code: '00-00',
    description: '',
    details: '',
    payload: {},
    ...body,
  };
  return {
    timestamp: new Date().toISOString(),
    jobId: cuid(),
    project: project,
    module: module,
    spec: spec,
    deploy: deploy,
    version: '0.0.1',
    status: {
      code: code,
      message: getStatusMessage(code),
      description: description,
      details: details,
    },
    payload: JSON.stringify(payload),
  };
}

module.exports = {
  getStatusMessage,
  hubMessage,
};
