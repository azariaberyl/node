import express from 'express'
import request from 'supertest';

const app = express()
app.get('/', (req, res) => {
  res.send('Halo Dek')
})

app.get('/books', (req, res) => {
  res.send('No Book')
})

test('Dicoba', async () => {
  let response = await request(app).get('/');
  expect(response.text).toBe('Halo Dek')
  
  response = await request(app).get('/books');
  expect(response.text).toBe('No Book')
})

test('Dcoba 2', async () => {
  let response = await request(app).get('/');
  expect(response.status).toBe(200);
})