import express from 'express';
import request from 'supertest';

const app = express();

const router = express.Router();
// Add middleware to router
router.use((req, res, next) => {
  console.info('Middleware from Router');
  next();
});

router.get('/feature/a', (req, res) => {
  res.send('Response from Router');
});

test('Router / feature disabled', async () => {
  let response = await request(app).get('/feature/a');
  expect(response.status).toBe(404);
});

test('Router / feature enabled', async () => {
  // Use router
  app.use(router);

  let response = await request(app).get('/feature/a');
  expect(response.text).toBe(`Response from Router`);
});
