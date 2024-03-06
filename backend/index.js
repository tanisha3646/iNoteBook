const connectToMongo = require('./db');
const express = require('express');

connectToMongo();
var cors = require('cors')
const app = express()

app.use(cors())
const port = 5000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.use(express.json());

// available routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`iNoteBook backend listening on port ${port}`)
})