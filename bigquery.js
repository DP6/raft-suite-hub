const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path');
const os = require('os');
const fs = require('fs');

let schemaExample = [
  {
    name: 'Column name',
    type: 'STRING', //INTEGER,FLOAT,BOOLEAN,RECORD,
    mode: 'REQUIRED', //opcional
  },
];

/**
 * Returns a bigquery dataset. If it doesn't exist, creates a new and then returns.
 * @param {String} datasetId
 * @returns {Dataset} 
 */
async function getOrCreateDataset(datasetId) {
  const bq = new BigQuery();
  const dataset = await bq.dataset(datasetId).get({ autoCreate: true });
  return dataset;
}

async function getOrCreateTable({ datasetId, tableName, schema }) {
  try {
    const dataset = await getOrCreateDataset(datasetId);

    const options = {
      schema,
      location: 'US',
      type: 'TABLE',
    };
    return dataset.table(tableName).get({
      autoCreate: true,
      ...options,
    });
  } catch (error) {
    console.error(`Error getting table ${tableName}:`, error);
    throw new Error(error);
  }
}

/**
 * Insert rows as stream at the given table and dataset.
 * @param {Array} rows - Array of objects that will be inserted
 * @param {*} datasetId
 * @param {*} tableName
 * @param {*} schema - Schema of the table, in case you need to create it.
 */
async function insertRowsAsStream(rows, datasetId, tableName, schema) {
  try {
    const table = await getOrCreateTable({ datasetId, tableName, schema });
    await table.insert(JSON.stringify(rows));
    console.info(`Inserted ${rows.lenght} in ${tableId}`);
  } catch (error) {
    console.error(`Error inserting ${rows.lenght} in ${tableId}. \n`, error);
  }
}

async function loadData(rows, datasetId, tableName, schema) {
  try {
    const metadata = {
      sourceFormat: 'NEWLINE_DELIMITED_JSON',
      location: 'US',
      writeDisposition: 'WRITE_APPEND',
    };
    const tempFilePath = path.join(os.tmpdir(), 'data.json');
    let data = rows instanceof Array ? rows : [rows];
    data = data.map((r) => JSON.stringify(r)).join('\n');
    fs.writeFileSync(tempFilePath, data);
    const table = await getOrCreateTable({ datasetId, tableName, schema });
    await table.load(tempFilePath, metadata, (err, apiResponse) => {
      if (err) throw new Error('Error loading job');
    });
  } catch (error) {
    console.error(`Error inserting ${rows.lenght} in ${tableId}. \n`, error);
  }
}

function formatEntrie([key, value]) {
  let type = 'STRING';
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
  }
  return {
    name: key,
    type: type,
  };
}

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
