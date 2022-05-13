const express = require('express')


const app = express()

var cors = require('cors');
app.use(cors());

app.use(express.json())
app.use(express.urlencoded())

// debug middleware for logging requests
app.use ((req, res, next) => {
    let body = JSON.stringify(req.body)
    console.log(`${Date.now().toString()} ${req.method} ${req.url} - ${body.slice(0, Math.min(50, body.length))}`)
    next()
})

app.use('/api/v1', require('./api'))

app.listen(process.env.PORT || 8080, () => {
    console.log('Server started at port', process.env.PORT || 8080)
})