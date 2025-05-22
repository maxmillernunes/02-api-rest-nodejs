import knex from 'knex'
import type { Knex } from 'knex'

export const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: './db/app.db',
  },
  useNullAsDefault: true,
  migrations: {
    directory: './db/migrations',
    extension: '.ts',
  },
}

export const knexInstance = knex(config)
