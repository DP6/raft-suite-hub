const { assert, expect } = require('chai');

const { formatEntrie, generateSchema } = require('../../bigquery');
const { hubMessage } = require('../../message');

const COLUMN_NAME = 'Teste';
const TYPES = [
  ['NUMERIC', 1.2],
  ['INT64', 1],
  ['RECORD', { a: 1 }],
  ['DATE', new Date().toISOString().slice(0, 10)],
  ['DATE', new Date().toISOString().slice(0, 10).replace(/-/g, '/')],
  ['TIME', new Date().toTimeString().slice(0, 8)],
  ['TIME', '1:0:30'],
  ['TIME', new Date().toISOString().slice(11, 23)],
  ['TIME', new Date().toISOString().slice(11, 19)],
  ['TIMESTAMP', new Date().toISOString()],
  ['DATETIME', new Date().toISOString().replace('Z', '')],
  ['STRING', 'TESTE'],
];
describe.only('BigQuery helper', () => {
  TYPES.forEach(function ([type, example]) {
    it(`formatEntrie - ${type}:${example}`, () => {
      let schema = formatEntrie([COLUMN_NAME, example]);
      expect(schema.name).to.equal(COLUMN_NAME);
      expect(schema.type).to.equal(type);
    });
  });
  it(`formatEntrie - Record fields`, () => {
    let schema = formatEntrie([COLUMN_NAME, { a: 1 }]);
    let { fields } = schema;
    expect(fields).to.be.a('array');
    let { name, type } = fields[0];
    expect(name).to.equal('a');
    expect(type).to.equal('INT64');
  });
  it('formatEntrie - Converte uma mensagem em schema', () => {
    const message = hubMessage();
    const schema = generateSchema(message);
  });
});
