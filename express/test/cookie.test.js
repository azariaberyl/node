import express from 'express';
import request from 'supertest';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  const name = req.cookies['name'];
  res.send(`Halo ${name}`);
});

app.post('/login', (req, res) => {
  const name = req.body.name;
  res.cookie('Login', name, { path: '/' });
  res.send(`Halo ${name}`);
});

app.get('/book/:id', (req, res) => {
  const name = req.cookies['name'];
  res.send(`${name} is looking for book with id ${req.params.id}`);
});

test('send cookie to server', async () => {
  let response = await request(app).get('/').set('Cookie', 'name=John;id=1');
  expect(response.text).toBe(`Halo John`);
});

test('server send cookie', async () => {
  let response = await request(app).post('/login').send({ name: 'John' });
  expect(response.get('Set-Cookie').toString()).toContain(`Login=John; Path=/`);
  expect(response.text).toBe(`Halo John`);
});
