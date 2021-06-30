const { assert, expect } = require('chai');

const { getStatusMessage, hubMessage } = require('../../message');

const REQUIRED_BODY = { module: 'Hub-test', spec: 'Message log', deploy: '1' };

describe('Arquivo de mensagens', () => {
  it('Converte 00-00 em uma mensagem', () => {
    const code = '00-00';
    const message = 'Em análise - Não há ocorrências';
    const statusMessage = getStatusMessage(code);
    expect(statusMessage).to.equal(message);
  });

  it('Converte 01-01 em uma mensagem', () => {
    const code = '01-01';
    const message = 'Disponibilidade - Há um problema na disponibilização do UserID';
    const statusMessage = getStatusMessage(code);
    expect(statusMessage).to.equal(message);
  });

  it('Mensagem gerada tem o schema esperado', () => {
    const message = hubMessage({ ...REQUIRED_BODY });
    expect(message).to.have.property('timestamp');
    expect(message).to.have.property('jobId');
    expect(message).to.have.property('project');
    expect(message).to.have.property('module');
    expect(message).to.have.property('spec');
    expect(message).to.have.property('deploy');
    expect(message).to.have.property('version');
    expect(message).to.have.property('status');
    expect(message).to.have.property('payload');
    expect(message.status).to.have.property('code');
    expect(message.status).to.have.property('message');
    expect(message.status).to.have.property('description');
    expect(message.status).to.have.property('details');
  });

  it('Mensagem gerada tem os tipos esperados', () => {
    const message = hubMessage({ ...REQUIRED_BODY });
    expect(message.timestamp).to.be.a('string');
    expect(message.jobId).to.be.a('string');
    expect(message.project).to.be.a('string');
    expect(message.module).to.be.a('string');
    expect(message.spec).to.be.a('string');
    expect(message.deploy).to.be.a('string');
    expect(message.version).to.be.a('string');
    expect(message.status).to.be.a('object');
    expect(message.status.code).to.be.a('string');
    expect(message.status.message).to.be.a('string');
    expect(message.status.description).to.be.a('string');
    expect(message.status.details).to.be.a('string');
    expect(message.payload).to.be.a('string');
  });

  it('Mensagem gerada tem os parâmetros obrigatórios preenchidos dinamicamente', () => {
    const message = hubMessage({ ...REQUIRED_BODY });
    expect(message.module).to.equal(REQUIRED_BODY.module);
    expect(message.spec).to.equal(REQUIRED_BODY.spec);
    expect(message.deploy).to.equal(REQUIRED_BODY.deploy);
  });
});
