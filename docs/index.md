## Functions

<dl>
<dt><a href="#createSchemaBq">createSchemaBq(result, queryString, schemaName)</a> ⇒ <code>Array</code></dt>
<dd><p>Monta as linhas para serem inseridas no BQ</p>
</dd>
<dt><a href="#addTimestamp">addTimestamp(data)</a> ⇒ <code>Object</code></dt>
<dd><p>Adiciona o atributo data para o objeto, contendo o timestamp do momento da execução</p>
</dd>
<dt><a href="#insertRowsAsStream">insertRowsAsStream(data)</a></dt>
<dd><p>Realiza a persistências dos dados por Stream no BigQuery</p>
</dd>
<dt><a href="#loadProjectConfig">loadProjectConfig()</a></dt>
<dd><p>Carrega o arquivo de configuração armazenado no GCS</p>
</dd>
<dt><a href="#trace">trace(log)</a></dt>
<dd><p>Enviado o log para o stdout, se somente se, a variável debugging = true</p>
</dd>
<dt><a href="#getOrCreateDataset">getOrCreateDataset(datasetId)</a> ⇒ <code>Dataset</code></dt>
<dd><p>Returns a bigquery dataset. If it doesn&#39;t exist, creates a new and then returns.</p>
</dd>
<dt><a href="#insertRowsAsStream">insertRowsAsStream(rows, datasetId, tableName, schema)</a></dt>
<dd><p>Insert rows as stream at the given table and dataset.</p>
</dd>
<dt><a href="#hubMessage">hubMessage(body)</a> ⇒ <code>Object</code></dt>
<dd></dd>
</dl>

<a name="createSchemaBq"></a>

## createSchemaBq(result, queryString, schemaName) ⇒ <code>Array</code>
Monta as linhas para serem inseridas no BQ

**Kind**: global function  
**Returns**: <code>Array</code> - Dados estruturados para o BQ  

| Param | Type | Description |
| --- | --- | --- |
| result | <code>Array</code> | Status das chaves validadas |
| queryString | <code>Object</code> |  |
| schemaName | <code>String</code> | Identificação do schema usado para validação |

<a name="addTimestamp"></a>

## addTimestamp(data) ⇒ <code>Object</code>
Adiciona o atributo data para o objeto, contendo o timestamp do momento da execução

**Kind**: global function  
**Returns**: <code>Object</code> - Objeto com o atributo no padrão yyyy-mm-ddThh:mm:ss  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Objeto |

<a name="insertRowsAsStream"></a>

## insertRowsAsStream(data)
Realiza a persistências dos dados por Stream no BigQuery

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Array</code> | Dados estruturados no padrão de persistência do BQ |

<a name="loadProjectConfig"></a>

## loadProjectConfig()
Carrega o arquivo de configuração armazenado no GCS

**Kind**: global function  
<a name="trace"></a>

## trace(log)
Enviado o log para o stdout, se somente se, a variável debugging = true

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| log | <code>Object</code> | Que será apresentado no stdout |

<a name="getOrCreateDataset"></a>

## getOrCreateDataset(datasetId) ⇒ <code>Dataset</code>
Returns a bigquery dataset. If it doesn't exist, creates a new and then returns.

**Kind**: global function  

| Param | Type |
| --- | --- |
| datasetId | <code>String</code> | 

<a name="insertRowsAsStream"></a>

## insertRowsAsStream(rows, datasetId, tableName, schema)
Insert rows as stream at the given table and dataset.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| rows | <code>Array</code> | Array of objects that will be inserted |
| datasetId | <code>\*</code> |  |
| tableName | <code>\*</code> |  |
| schema | <code>\*</code> | Schema of the table, in case you need to create it. |

<a name="hubMessage"></a>

## hubMessage(body) ⇒ <code>Object</code>
**Kind**: global function  
**Returns**: <code>Object</code> - - Structured message.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| body | <code>object</code> |  | Request body |
| [body.project] | <code>string</code> | <code>&quot;GCP Project&quot;</code> | Name of the project. |
| body.module | <code>string</code> |  | Name of the module that sent the message. |
| body.spec | <code>string</code> |  | Division of the module |
| body.deploy | <code>number</code> |  | Module or Cloud Function version |
| [body.code] | <code>string</code> | <code>&quot;\&quot;00-00\&quot;&quot;</code> | Status code, will be used to get the message. |
| [body.description] | <code>string</code> |  | Description of the status |
| [body.details] | <code>string</code> |  | JSON field with details and specific log to explain the status |
| [body.payload] | <code>Object</code> |  | JSON payload that will be passed without changing the table structure |

