import { beforeAll, describe, afterAll, it, expect, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'

import { app } from '../src/app.js'

describe('Transactions routes', async () => {
  // Await the app to be ready before running tests
  // This is important to ensure that the server is fully initialized
  beforeAll(async () => {
    await app.ready()
  })

  // Close the app after all tests are done
  // This is important to ensure that the server is properly shut down
  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run -- knex migrate:rollback --all')
    execSync('npm run -- knex migrate:latest')
  })

  it('Should ble able to create a new transaction', async () => {
    const res = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })

  it('Should ble able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 3000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies!)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New Transaction',
        amount: 3000,
      }),
    ])
  })

  it('Should ble able to get a specific transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 3000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies!)
      .expect(200)

    const transactionId = listTransactionsResponse.body.transactions[0].id
    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies!)
      .expect(200)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New Transaction',
        amount: 3000,
      })
    )
  })

  it('Should ble able to get the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies!)
      .send({
        title: 'Debit Transaction',
        amount: 2000,
        type: 'debit',
      })

    const getTransactionResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies!)
      .expect(200)

    expect(getTransactionResponse.body.summary).toEqual({ amount: 3000 })
  })
})
