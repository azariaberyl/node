import express from 'express';
import request from 'supertest';

const app = express();

app.get('/', (req, res) => {
  res.send('Halo Dek');
});

app.get('/book/:id', (req, res) => {
  res.send(`You're looking for book with id ${req.params.id}`);
});

test('Get book by id', async () => {
  let response = await request(app).get('/book/837923');
  expect(response.text).toBe(`You're looking for book with id 837923`);
});
