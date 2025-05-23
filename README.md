## Config knex to running migration

- Add this lines from your package.json

```json
"scripts": {
  "knex": "tsx ./node_modules/knex/bin/cli.js --knexfile knexfile.ts",
  },
```

### How create and running a new migration using knex with typescript

- Run this comande in your terminal to create

```bash
npm run knex -- migrate:make migration-name -x ts
```

- Run this comande in your terminal to run

```bash
npm run knex -- migrate:latest
```

### Reason why it's necessary using this.
```
O --knexfile knexfile.ts no script já informa o arquivo de configuração TS.
A flag -x ts deve ser passada após o subcomando (migrate:make) para indicar que as migrations são TypeScript.
O -- no comando npm é necessário para passar argumentos para o script.
```

# Documentação, RF, RN, RNF

### RF

[ ] O usuário deve poder criar uma nova transação;
[ ] O usuário deve poder obter um resumo da sua conta;
[ ] O usuário deve poder listar todas as transações que já ocorreram;
[ ] O usuário deve poder visualizar uma transação única;

### RN

[ ] A transação pode ser do tipo crédito que somará ao valor total ou débito que subtrairá;
[ ] Deve ser possível identificarmos o usuário entre as requisições;
[ ] O usuário so pode visualizar transações o qual ele criou;

### RNF

[ ] 