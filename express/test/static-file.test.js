import express from 'express';
import request from 'supertest';

const app = express();
// app.use(express.static(__dirname + '/static'));
app.use('/static', express.static(__dirname + '/static')); // Prefix path

app.get('/', (req, res) => {
  res.send('Hello world');
});

// It will be error if u use prefix path because the route `/example.txt` doesn't exist
test.failing('Without prefix path', async () => {
  let response = await request(app).get('/example.txt');
  expect(response.text).toBe(`This is example text`);
});

test('With prefix path', async () => {
  // Using prefix path, u need to put the prefixPath/filename.ext -> for example:
  let response = await request(app).get('/static/example.txt');
  expect(response.text).toBe(`This is example text`);
});
