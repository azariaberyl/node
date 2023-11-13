import express from 'express';
import request from 'supertest';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send(`${req.query.name}: ${req.query.balance}`);
});

app.get('/path', (req, res) => {
  res.send(
    JSON.stringify({
      originalUrl: req.originalUrl,
      path: req.path,
      hostname: req.hostname,
      protocol: req.protocol,
    })
  );
});

app.get('/header', (req, res) => {
  const type = req.get('Accept');
  res.send(`The header Accept: ${type}`);
});

app.post('/json', (req, res) => {
  const body = req.body;
  res.json({
    hello: `Hello ${body.name}`,
  });
});

app.post('/form', (req, res) => {
  const body = req.body;
  console.log(JSON.stringify(body));
  res.json({
    hello: `Hello ${body.name}`,
  });
});
// Request
test('req query', async () => {
  let response = await request(app).get('/').query({
    name: 'John',
    balance: 1000,
  });
  expect(response.text).toBe('John: 1000');
});

test('req url', async () => {
  let response = await request(app).get('/path').query({
    name: 'John',
    balance: 1000,
  });
  expect(response.text).toBe(
    '{"originalUrl":"/path?name=John&balance=1000","path":"/path","hostname":"127.0.0.1","protocol":"http"}'
  );
});

test('req get header', async () => {
  let response = await request(app).get('/header').set('accept', 'text/plain');
  expect(response.text).toBe('The header Accept: text/plain');
});

test('req send json', async () => {
  let response = await request(app).post('/json').set('Content-Type', 'application/json').send({ name: 'John' });
  expect(response.text).toEqual(
    JSON.stringify({
      hello: `Hello John`,
    })
  );
});

test('req send form', async () => {
  let response = await request(app)
    .post('/form')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send('name=John');
  expect(response.text).toEqual(
    JSON.stringify({
      hello: `Hello John`,
    })
  );
});
