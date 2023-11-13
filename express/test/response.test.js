import express from 'express';
import request from 'supertest';

const app = express();

app.get('/', (req, res) => {
  res.send('Halo Dek');
});

app.get('/books', (req, res) => {
  res.send('No Book');
});

app.get('/status', (req, res) => {
  if (req.query.name) {
    res.status(200);
    res.send('Ok mase');
  } else {
    res.status(400);
    res.send('error mase');
  }
});

app.get('/header', (req, res) => {
  res.set({ Token: 'Halo dek' });
  res.send('Send header');
});

app.get('/redirect', (req, res) => {
  res.redirect('/to-next-page');
  // res.redirect(301,'/to-next-page');
  // res.redirect('www.google.com');
});

// Response
test('response body', async () => {
  let response = await request(app).get('/');
  expect(response.text).toBe('Halo Dek');

  response = await request(app).get('/books');
  expect(response.text).toBe('No Book');
});

test('res status', async () => {
  let response = await request(app).get('/status').query({ name: 'John' });
  expect(response.status).toBe(200);

  response = await request(app).get('/status');
  expect(response.status).toBe(400);
});

test('res set header', async () => {
  let response = await request(app).get('/header').query({ name: 'John' });
  expect(response.get('token')).toBe('Halo dek');
});

test('res redirect', async () => {
  let response = await request(app).get('/redirect');
  expect(response.status).toBe(302);
  expect(response.get('Location')).toBe('/to-next-page');
});
