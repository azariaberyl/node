import express from 'express';
import request from 'supertest';

test('response body', async () => {
  const app = express();
  app.get('/', (req, res) => {
    res.send('Halo Dek');
  });

  app.get('/books', (req, res) => {
    res.send('No Book');
  });

  let response = await request(app).get('/');
  expect(response.text).toBe('Halo Dek');

  response = await request(app).get('/books');
  expect(response.text).toBe('No Book');
});

test('res status', async () => {
  const app = express();
  app.get('/', (req, res) => {
    if (req.query.name) {
      res.status(200);
      res.send('Ok mase');
    } else {
      res.status(400);
    }
  });

  let response = await request(app).get('/').query({ name: 'John' });
  expect(response.status).toBe(200);

  response = await request(app).get('/');
  expect(response.status).toBe(400);
});

test('res set header', async () => {
  const app = express();
  app.get('/', (req, res) => {
    res.set('Token', 'Halo dek');
  });

  let response = await request(app).get('/').query({ name: 'John' });
  expect(response.get('token')).toBe('Halo dek');
});

// Request
test('req query', async () => {
  const app = express();
  app.get('/', (req, res) => {
    res.send(`${req.query.name}: ${req.query.balance}`);
  });

  let response = await request(app).get('/').query({
    name: 'John',
    balance: 1000,
  });
  expect(response.text).toBe('John: 1000');
});

test('req url', async () => {
  const app = express();
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

  let response = await request(app).get('/path').query({
    name: 'John',
    balance: 1000,
  });
  expect(response.text).toBe(
    '{"originalUrl":"/path?name=John&balance=1000","path":"/path","hostname":"127.0.0.1","protocol":"http"}'
  );
});

test('req get header', async () => {
  const app = express();
  app.get('/path', (req, res) => {
    const type = req.get('Accept');
    res.send(`The header Accept: ${type}`);
  });

  let response = await request(app).get('/path').set('accept', 'text/plain');
  expect(response.text).toBe('The header Accept: text/plain');
});
