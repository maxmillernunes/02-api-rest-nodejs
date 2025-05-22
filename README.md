## Config knex to running migration

- Add this lines from your package.json

```json
"scripts": {
  "knex": "tsx ./node_modules/knex/bin/cli.js --knexfile knexfile.ts",
  },
```

### How create a new migration using knex with typescript

- Run this comande in your terminal

```bash
npm run knex -- migrate:make migration-name -x ts
```

### Reason why its necessary using this.
```
O --knexfile knexfile.ts no script já informa o arquivo de configuração TS.
A flag -x ts deve ser passada após o subcomando (migrate:make) para indicar que as migrations são TypeScript.
O -- no comando npm é necessário para passar argumentos para o script.
```