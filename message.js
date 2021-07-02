const cuid = require('cuid');
const status = require('./status.json');
const { version } = require('./package.json');

/**
 * Transforms a status code on a message.
 * @param {string} statusCode - raft suite status code, like "00-00"
 * @returns {string} - formatted dimension and message
 */
function getStatusMessage(statusCode) {
  let [dimension, code] = statusCode.split('-');
  dimension = status[dimension];
  code = dimension.codes[code];
  return `${dimension.dimension} - ${code}`;
}

/**
 * Receives the body and returns the raft suite hub message.
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
  const project = body.project || process.env.GCP_PROJECT || 'DP6';
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
    project,
    module,
    spec,
    deploy,
    version,
    status: {
      code,
      message: getStatusMessage(code),
      description,
      details,
    },
    payload: JSON.stringify(payload),
  };
}

module.exports = {
  getStatusMessage,
  hubMessage,
};
