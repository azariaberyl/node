import express from 'express';

// Express App
export const app = express();
const port = 8000;

// Routing
app.get('/', (req, res) => {
  res.send('Halo Dek')
})

// Chained route handler
app.route('/book')
  .get((req, res) => {
    res.send('Get a random book')
  })
  .post((req, res) => {
    res.send('Add a book')
  })
  .put((req, res) => {
    res.send('Update the book')
  })

app.listen(port, () => {
  console.log('Server started')
})