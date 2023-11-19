import express from 'express';
import request from 'supertest';

const app = express();

// Create middleware
const middleware = (req, res, next) => {
  res.set('X-Powered-By', 'Middleware');
  next();
};

const apiKeyMiddleware = (req, res, next) => {
  if (req.query.apiKey) {
    next();
  } else {
    res.status(401).end();
  }
};

// Error middle ware, use it after the last route
const errorMiddleware = (err, req, res, next) => {
  res.status(500).send(`Terjadi error: ${err.message}`);
};

// Not found error middle ware, use it after the last route
const notFoundMiddleware = (req, res, next) => {
  res.status(404).send(`404 Not Found`);
};

// Use the middleware
app.use(apiKeyMiddleware);
app.use(middleware);

app.get('/', (req, res) => {
  res.send('Halo Dek');
});

app.get('/books', (req, res) => {
  res.send('No Book');
});

app.get('/error', (req, res) => {
  throw new Error('Error ngab');
});

app.use(errorMiddleware);
app.use(notFoundMiddleware);

test('Middleware add header', async () => {
  let response = await request(app).get('/').query({ apiKey: '123' });
  expect(response.get('X-Powered-By')).toBe('Middleware');
});

test('Middleware stop before routing', async () => {
  let response = await request(app).get('/');
  expect(response.status).toBe(401);
});

test('Middleware test error', async () => {
  let response = await request(app).get('/error').query({ apiKey: '213' });
  expect(response.status).toBe(500);
  expect(response.text).toBe('Terjadi error: Error ngab');
});

test('Middleware test not found error', async () => {
  let response = await request(app).get('/notfound').query({ apiKey: '213' });
  expect(response.status).toBe(404);
  expect(response.text).toBe('404 Not Found');
});
