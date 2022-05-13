const express = require('express')


const app = express()

var cors = require('cors');
app.use(cors());

app.use(express.json())
app.use(express.urlencoded())

// debug middleware for logging requests
app.use ((req, res, next) => {
    // clear sensitive info
    let msg_body = {...req.body}
    if (msg_body.password) {
        msg_body.password = '...'
    }
    let body = JSON.stringify(msg_body)
    console.log(`${Date.now().toString()} ${req.method} ${req.url} - ${body}`)
    next()
})

app.use('/api/v1', require('./api'))

app.listen(process.env.PORT || 8080, () => {
    console.log('Server started at port', process.env.PORT || 8080)
})