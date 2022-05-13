const { Router } = require('express')
const axios = require('axios')
const sqlite3 = require('sqlite3').verbose();
const path = require('path')
const db = new sqlite3.Database(process.env.STOCKER_DB);
const bcrypt = require('bcrypt')

let router = Router()

var stock_pool = null



router.get('/stock', (req, res) => {
    db.all(`SELECT * FROM Stocks;`, (err, rows) => {
        if (err) {
            console.error(err)
            res.sendStatus(400);
        }
        else {
            res.send(rows);
        }
    })
})


router.post('/selection', (req, res) => {
    let data = req.body;
})

router.post('/auth', (req, res) => {

})


module.exports = router