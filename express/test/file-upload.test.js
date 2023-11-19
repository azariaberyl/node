import express from 'express';
import fileUpload from 'express-fileupload';
import request from 'supertest';

const app = express();
app.use(fileUpload());

app.post('/upload', function (req, res) {
  const file = req.files.article;
  file.mv(__dirname + '/upload/' + file.name);

  res.send(`You uploaded ${file.name}`);
});

test('Router / feature enabled', async () => {
  let response = await request(app)
    .post('/upload')
    .field('name', 'John')
    .attach('article', __dirname + '/static/example.txt');
  expect(response.text).toBe(`You uploaded example.txt`);
});
