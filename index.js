const express = require('express')


const app = express()

app.use(express.json())
app.use(express.urlencoded())

// debug middleware for logging requests
app.use ((req, res, next) => {
    console.log(`${Date.now().toString()} ${req.method} ${req.url} - ${req.body}`)
    next()
})

app.route('/api/v1', require('./api'))

app.listen(process.env.PORT || 3000, () => {
    console.log('Server started at port', process.env.PORT || 3000)
})