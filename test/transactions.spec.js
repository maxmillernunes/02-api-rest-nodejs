"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const node_child_process_1 = require("node:child_process");
const supertest_1 = __importDefault(require("supertest"));
const app_js_1 = require("../src/app.js");
(0, vitest_1.describe)('Transactions routes', async () => {
    // Await the app to be ready before running tests
    // This is important to ensure that the server is fully initialized
    (0, vitest_1.beforeAll)(async () => {
        await app_js_1.app.ready();
    });
    // Close the app after all tests are done
    // This is important to ensure that the server is properly shut down
    (0, vitest_1.afterAll)(async () => {
        await app_js_1.app.close();
    });
    (0, vitest_1.beforeEach)(async () => {
        (0, node_child_process_1.execSync)('npm run -- knex migrate:rollback --all');
        (0, node_child_process_1.execSync)('npm run -- knex migrate:latest');
    });
    (0, vitest_1.it)('Should ble able to create a new transaction', async () => {
        const res = await (0, supertest_1.default)(app_js_1.app.server)
            .post('/transactions')
            .send({
            title: 'New Transaction',
            amount: 5000,
            type: 'credit',
        })
            .expect(201);
    });
    (0, vitest_1.it)('Should ble able to list all transactions', async () => {
        const createTransactionResponse = await (0, supertest_1.default)(app_js_1.app.server)
            .post('/transactions')
            .send({
            title: 'New Transaction',
            amount: 3000,
            type: 'credit',
        });
        const cookies = createTransactionResponse.get('Set-Cookie');
        const listTransactionsResponse = await (0, supertest_1.default)(app_js_1.app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200);
        (0, vitest_1.expect)(listTransactionsResponse.body.transactions).toEqual([
            vitest_1.expect.objectContaining({
                title: 'New Transaction',
                amount: 3000,
            }),
        ]);
    });
    (0, vitest_1.it)('Should ble able to get a specific transaction', async () => {
        const createTransactionResponse = await (0, supertest_1.default)(app_js_1.app.server)
            .post('/transactions')
            .send({
            title: 'New Transaction',
            amount: 3000,
            type: 'credit',
        });
        const cookies = createTransactionResponse.get('Set-Cookie');
        const listTransactionsResponse = await (0, supertest_1.default)(app_js_1.app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200);
        const transactionId = listTransactionsResponse.body.transactions[0].id;
        const getTransactionResponse = await (0, supertest_1.default)(app_js_1.app.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', cookies)
            .expect(200);
        (0, vitest_1.expect)(getTransactionResponse.body.transaction).toEqual(vitest_1.expect.objectContaining({
            title: 'New Transaction',
            amount: 3000,
        }));
    });
    (0, vitest_1.it)('Should ble able to get the summary', async () => {
        const createTransactionResponse = await (0, supertest_1.default)(app_js_1.app.server)
            .post('/transactions')
            .send({
            title: 'New Transaction',
            amount: 5000,
            type: 'credit',
        });
        const cookies = createTransactionResponse.get('Set-Cookie');
        await (0, supertest_1.default)(app_js_1.app.server)
            .post('/transactions')
            .set('Cookie', cookies)
            .send({
            title: 'Debit Transaction',
            amount: 2000,
            type: 'debit',
        });
        const getTransactionResponse = await (0, supertest_1.default)(app_js_1.app.server)
            .get('/transactions/summary')
            .set('Cookie', cookies)
            .expect(200);
        (0, vitest_1.expect)(getTransactionResponse.body.summary).toEqual({ amount: 3000 });
    });
});
