import fastify from 'fastify'
import { knexInstance } from './database'

const app = fastify()

app.get('/hello', async (req, res) => {
  const transactions = await knexInstance('transactions')
    .where('amount', 1000)
    .select('*')

  return res.status(200).send({ transactions })
})

app.listen({ port: 3333 }).then(() => {
  console.log('Server is running on http://localhost:3333')
})
