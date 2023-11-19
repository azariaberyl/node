import express from 'express';
import request from 'supertest';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser('SECRETKEY'));
app.use(express.json());

app.get('/', (req, res) => {
  const name = req.cookies['name'];
  res.send(`Halo ${name}`);
});

// set cookie
app.post('/login', (req, res) => {
  const name = req.body.name;
  res.cookie('Login', name, { path: '/', signed: true });
  res.send(`Halo ${name}`);
});

app.get('/profile', (req, res) => {
  const name = req.signedCookies['Login'];
  res.send(`Hello ${name}`);
});

// Test
test('send cookie to server', async () => {
  let response = await request(app).get('/').set('Cookie', 'name=John;id=1');
  expect(response.text).toBe(`Halo John`);
});

test('send no cookie to needed cookie route', async () => {
  let response = await request(app).get('/');
  expect(response.text).toBe(`Halo undefined`);
});

test('server send cookie', async () => {
  let response = await request(app).post('/login').send({ name: 'John' });
  expect(response.get('Set-Cookie').toString()).toContain(`John`);
  expect(response.text).toBe(`Halo John`);
});

test('signed cookie from server', async () => {
  let response = await request(app).post('/login').send({ name: 'John' });
  expect(response.get('Set-Cookie').toString()).not.toContain(`Login=John; Path=/`);
  expect(response.text).toBe(`Halo John`);
});

test('send signed cookie to server', async () => {
  let response = await request(app)
    .get('/profile')
    .set('Cookie', 'Login=s%3AJohn.XTY1mNaMlq4FhO2soJukp8yLw5XY2hIWRLsImiOjoVo');
  expect(response.text).toBe(`Hello John`);
});
