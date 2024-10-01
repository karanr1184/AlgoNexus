const {pool} = require('./config/db')
const express = require('express')
var cors = require('cors') 
const app = express()
const port = 3000;

app.use(express.json())
app.use(cors())
app.use("/posts", require('./routes/postRouter'))
// app.use("/users", require('./routes/postRouterUser'))

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })