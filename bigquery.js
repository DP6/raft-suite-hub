const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path');
const os = require('os');
const fs = require('fs');

/**
 * Returns a bigquery dataset. If it doesn't exist, creates a new and then returns.
 * @param {string} datasetId
 * @param {bool} autoCreate
 * @returns {Dataset}
 */
async function getOrCreateDataset(datasetId, autoCreate = true) {
  const bq = new BigQuery();
  if (autoCreate) await bq.dataset(datasetId).get({ autoCreate: true });
  return bq.dataset(datasetId);
}

/**
 * Returns a bigquery table. If it doesn't exist, creates a new and then returns.
 * @param {string} $.datasetId
 * @param {string} $.tableName
 * @param {Array} [$.schema]
 * @returns {Table}
 */
async function getOrCreateTable({ datasetId, tableName, schema }) {
  try {
    const dataset = await getOrCreateDataset(datasetId);
    const options = {
      schema,
      location: 'US',
      type: 'TABLE',
    };
    if (schema)
      await dataset.table(tableName).get({
        autoCreate: true,
        ...options,
      });
    return dataset.table(tableName);
  } catch (error) {
    console.error(`Error getting table ${tableName}:`, error);
    throw new Error(error);
  }
}

/**
 * Insert rows as stream at the given table and dataset.
 * @param {Array} rows - Array of objects that will be inserted
 * @param {string} datasetId
 * @param {string} tableName
 * @param {string} schema - Schema of the table, in case you need to create it.
 */
async function insertRowsAsStream(rows, datasetId, tableName, schema) {
  try {
    const schema = generateSchema(rows[0] || rows);
    const table = await getOrCreateTable({ datasetId, tableName, schema });
    await table.insert(JSON.stringify(rows));
    console.info(`Inserted ${rows.lenght} in ${tableId}`);
  } catch (error) {
    console.error(`Error inserting ${rows.lenght} in ${tableId}. \n`, error);
  }
}

/**
 * Insert rows as load job at the given table and dataset.
 * @param {Array} rows - Array of objects that will be inserted
 * @param {string} datasetId
 * @param {string} tableName
 */
async function loadData(rows, datasetId, tableName) {
  try {
    const metadata = {
      sourceFormat: 'NEWLINE_DELIMITED_JSON',
      location: 'US',
      writeDisposition: 'WRITE_APPEND',
    };
    let data = rows instanceof Array ? rows : [rows];
    const schema = generateSchema(data[0]);
    data = data.map((r) => JSON.stringify(r)).join('\n');

    const tempFilePath = path.join(os.tmpdir(), 'data.json');
    fs.writeFileSync(tempFilePath, data);
    const table = await getOrCreateTable({ datasetId, tableName, schema });
    console.info(`Trying to create load job with ${data.length} rows.`);
    await table.load(tempFilePath, metadata, (err, apiResponse) => {
      if (err) {
        throw new Error(err);
      }
    });
    fs.unlinkSync(tempFilePath);
  } catch (error) {
    console.error(`Error inserting ${rows.lenght || 1} row in ${tableName}. \n`, error);
  }
}

/**
 *
 * @param {Array} entrie - object entrie.
 * @returns {object} BigQuery field schema.
 */
function formatEntrie([key, value]) {
  let type = 'STRING';
  let entry = {
    name: key,
  };
  if (typeof value === 'string') {
    let regex =
      /(?<date>\d{4}[-\/]\d{1,2}[-\/]\d{1,2})?[\sT]?(?<time>\d{1,2}:\d{1,2}:\d{1,2}\.?(\d{1,6})?)?(?<timezone>Z|([+-]\d{1,2}(:\d{2})?))?/;
    if (regex.test(value)) {
      let { date, time, timezone } = value.match(regex).groups;
      if (date && time) {
        type = timezone ? 'TIMESTAMP' : 'DATETIME';
      } else {
        type = date ? 'DATE' : time ? 'TIME' : 'STRING';
      }
    } else {
      type = 'STRING';
    }
  } else if (typeof value === 'number') {
    type = Number.isInteger(value) ? 'INT64' : 'NUMERIC';
  } else if (typeof value === 'object') {
    type = 'RECORD';
    entry.fields = generateSchema(value);
  }
  entry.type = type;
  return entry;
}
/**
 * Generates a BigQuery schema from the json data.
 * @param {object} json - data formatted as json object
 * @returns {Array} - BigQuery schema.
 */
function generateSchema(json) {
  let data = json instanceof Array ? json[0] : json;
  let entries = Object.entries(data);
  return entries.map(formatEntrie);
}

module.exports = {
  formatEntrie,
  generateSchema,
  insertRowsAsStream,
  loadData,
};
