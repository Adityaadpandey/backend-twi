// requirements
const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors');
// connect to mongodb
connectToMongo();

const app = express()
let port = process.env.PORT || 5000

app.use(express.json());
app.use(cors())

//  Avialable Route
app.get('/', (req, res) => {
  res.send('Hello Aditya pandey')
})
app.use('/api/auth',require('./routes/auth'))
app.use('/api/allpost',require('./routes/allpost'))
app.use('/api/userpost',require('./routes/userpost'))

// app.use('/api/notes',require('./routes/notes'))


app.listen(port, () => {
  console.log(`Twi backend listening at http://localhost:${port}`)
})