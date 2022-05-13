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
    let user = req.body.user
    let password = req.body.password
    if (!user || !password) {
        res.sendStatus(400);
    }
    else {
        bcrypt.hash(password, 12, (err, hash) => {
            if (err) {
                // problem with hashing process
                console.error(err)
                res.sendStatus(400);
            }
            else {
                const user_check = db.prepare('SELECT * from users WHERE name=? AND password=?;')
                user_check.all([user, password], (err, rows) => {
                    if (err) {
                        console.error(err)
                        res.sendStatus(400);
                    }
                    else {
                        if (rows.length == 0) {
                            // user not found or password incorrect
                            res.sendStatus(404);
                        }
                        else if (rows.length > 1) {
                            // multiple users matching username/password
                            // this should never be called
                            res.sendStatus(500);
                        }
                        else {
                            // send successful user login info sans password hash
                            let data = rows[0];
                            data.password = undefined
                            res.send(data);
                        }
                    }
                })
            }
        })
    }
})


module.exports = router