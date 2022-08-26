const express = require('express')
const app = express()
const port = 3000
const routes = require('./routes')
const { errorHandler } = require('./utils/errrorHandler')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api',routes)
app.use(errorHandler)

app.listen(port, function (){
    console.log('listening on port '+port)
    console.log(`http://localhost:${port}`)
})
