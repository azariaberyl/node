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

// Use the middleware
app.use(apiKeyMiddleware);
app.use(middleware);

app.get('/', (req, res) => {
  res.send('Halo Dek');
});

app.get('/books', (req, res) => {
  res.send('No Book');
});

test('Middleware add header', async () => {
  let response = await request(app).get('/').query({ apiKey: '123' });
  expect(response.get('X-Powered-By')).toBe('Middleware');
});

test('Middleware stop before routing', async () => {
  let response = await request(app).get('/');
  expect(response.status).toBe(401);
});
