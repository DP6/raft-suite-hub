# Raft Suite Hub

<div align="center">
<img src="https://raw.githubusercontent.com/DP6/templates-centro-de-inovacoes/main/public/images/centro_de_inovacao_dp6.png" height="100px" />
</div>

<p align="center">
  <a href="#badge">
    <img alt="semantic-release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg">
  </a>
  <a href="https://www.codacy.com/gh/DP6/a8ef88ae93a84efbae676f2fa0a4bebb/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=DP6/raft-suite-hub&amp;utm_campaign=Badge_Coverage"><img alt="Code coverage" src="https://app.codacy.com/project/badge/Coverage/a8ef88ae93a84efbae676f2fa0a4bebb"/></a>
  <a href="#badge">
    <img alt="Test" src="https://github.com/dp6/raft-suite-hub/actions/workflows/test.yml/badge.svg">
  </a>
  <a href="https://www.codacy.com/gh/DP6/template-default-initiative-js/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=DP6/template-default-initiative-js&amp;utm_campaign=Badge_Grade">
    <img alt="Code quality" src="https://app.codacy.com/project/badge/Grade/a8ef88ae93a84efbae676f2fa0a4bebb">
  </a>
</p>

Raft-suite é um ecossistema criado pela DP6 para garantir a qualidade dos dados ([Data Quality](https://en.wikipedia.org/wiki/Data_quality)) nos projetos de engenharia de dados implementados nos clientes da DP6, através de monitoramento automatizados de dados.

O **Hub** é a solução responsável por centralizar a **consolidação** dos dados no BigQuery, ferramenta escolhida para servir de data warehouse do raft-suite.

## Conteúdo

- [Raft Suite Hub](#raft-suite-hub)
  - [Conteúdo](#conteúdo)
  - [1. Requisitos para utilização](#1-requisitos-para-utilização)
    - [1.1 Produtos Google Cloud Platform (GCP)](#11-produtos-google-cloud-platform-gcp)
    - [1.2 Dependências do ambiente local](#12-dependências-do-ambiente-local)
  - [2. Instalando o hub](#2-instalando-o-hub)
  - [3. Usando o Hub](#3-usando-o-hub)
    - [3.1 Schema da tabela](#31-schema-da-tabela)
  - [4. Observações](#4-observações)
  - [Como contribuir](#como-contribuir)
    - [Requisitos obrigatórios](#requisitos-obrigatórios)
    - [Api Docs](#api-docs)
  - [Suporte](#suporte)
    - [DP6 Koopa-troopa Team](#dp6-koopa-troopa-team)

## 1. Requisitos para utilização

### 1.1 Produtos Google Cloud Platform (GCP)

- Cloud Functions
- BigQuery

### 1.2 Dependências do ambiente local

- NodeJS >= 14.17.1
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)

## 2. Instalando o hub

1. Acesse o Cloud Shell ou um terminal com git e o gcloud sdk
2. Clone o repositório

   ```shell
    git clone https://github.com/DP6/raft-suite-hub.git
   ```

3. Em seguida, navegue para a pasta e use o comando deploy

   ```shell
    cd raft-suite-hub
    gcloud functions deploy hub-raft-suite-deploy --entry-point=app --trigger-http
   ```

   Opcionalmente, você pode preencher as variáveis de ambiente `DATASET_ID`, `TABLE_ID` e `INSERT_TYPE` com a flag --set-env-vars:

   ```shell
    cd raft-suite-hub
    gcloud functions deploy hub-raft-suite-deploy --entry-point=app --trigger-http --set-env-vars DATASET_ID=[dataset] TABLE_ID=[table] INSERT_TYPE=[batch ou stream]
   ```

## 3. Usando o Hub

Para utilizar, é preciso fazer uma requisição POST para a cloud function com um json no body. Por exemplo, em Node com [axios](https://github.com/axios/axios):

```js
const axio = require('axios');
let body = {
  module: 'penguin-datalayer-collect',
  spec: 'dp6_site',
  deploy: '2.0.0',
  code: '01-00',
  description: 'Saving collect data',
  payload: {
    status: 'OK',
    objectName: 'event',
    keyName: 'eventCategory',
    message: '',
  },
};
axios.post('https://us-central1-dp6-brasil.cloudfunctions.net/hub-raft-suite', body);
```

### 3.1 Schema da tabela

| Parâmetro        | Tipo     | Exemplo             | Obritatório | Descrição                                                                   |
| ---------------- | -------- | ------------------- | ----------- | --------------------------------------------------------------------------- |
| body             | `object` | -                   | Sim         | Request body                                                                |
| body.project     | `string` |                     | Não         | Nome do projeto                                                             |
| body.module      | `string` | `penguin-datalayer` | Sim         | Nome do módulo que enviou a mensagem                                        |
| body.spec        | `string` | `dp6_site`          | Sim         | Detalhe sobre a execução do módulo                                          |
| body.deploy      | `number` | `2.1.0`             | Sim         | Versão do módulo ou cloud function                                          |
| body.code        | `string` | `01-00`             | Não         | Código usado para definir a dimensão e o status                             |
| body.description | `string` |                     | Não         | Descrição do status                                                         |
| body.details     | `string` |                     | Não         | --                                                                          |
| body.payload     | `Object` | {}                  | Não         | Informações específicas dos módulos, que serão escritas como JSON na tabela |

## 4. Observações

Por padrão, as cloud functions do tipo http só podem ser executadas com autenticação. Por isso, a requisição post precisa ser feita de um local autenticado, ou com o token de autenticação.

## Como contribuir

Pull requests são bem-vindos! Nós vamos adorar ajuda para evoluir esse modulo. Sinta-se livre para navegar por issues abertas buscando por algo que possa fazer. Caso tenha uma nova feature ou bug, por favor abra uma nova issue para ser acompanhada pelo nosso time.

### Requisitos obrigatórios

Só serão aceitas contribuições que estiverem seguindo os seguintes requisitos:

- [Padrão de commit](https://www.conventionalcommits.org/en/v1.0.0/)

### Api Docs

- [Index.js](https://github.com/dp6/template-default-initiative-js/blob/master/docs/index.md)

## Suporte

### DP6 Koopa-troopa Team

_e-mail: <koopas@dp6.com.br>_

<img src="https://raw.githubusercontent.com/DP6/templates-centro-de-inovacoes/main/public/images/koopa.png" height="100px" width=50px/>
