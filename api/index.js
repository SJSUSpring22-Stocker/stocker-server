const { Router } = require('express')
const axios = require('axios')
const sqlite3 = require('sqlite3').verbose();
const path = require('path')
const db = new sqlite3.Database(process.env.STOCKER_DB);
const bcrypt = require('bcrypt')
const {  v4: uuidv4 } = require('uuid');

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

    let user = data['user']
    if (!user) {
        res.status(404).send({error: `Missing user information.`})
        return
    }
    let stock = data['Stock']
    if (!stock) {
        res.status(404).send({error: `Missing stock information.`})
        return
    }
    let price = data['Price']
    if (!price) {
        res.status(404).send({error: `Missing price information.`})
        return
    }
    let change = data['Change']
    if (!change) {
        res.status(404).send({error: `Missing Change information.`})
        return
    }
    let stage = data['App Stage']
    if (!stage) {
        res.status(404).send({error: `Missing App Stage information.`})
        return
    }
    let liked = data['Liked?']
    if (!liked) {
        res.status(404).send({error: `Missing liked information.`})
        return
    }
    let id = uuidv4()

    db.serialize(() => {
        const stmt = db.prepare("INSERT INTO test_data VALUES (?,?,?,?,?,?,?)");
        stmt.run([id, user, stock, price, change, stage, liked], (err) => {
            res.status(400).send(err);
        })
        stmt.finalize();
    })
    res.sendStatus(200)
})

router.post('/auth', (req, res) => {
    let user = req.body.user
    let password = req.body.password
    if (!user || !password) {
        res.sendStatus(400);
    }
    else {
        const user_check = db.prepare('SELECT * from users WHERE name=?;')
        user_check.all([user], async (err, rows) => {
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
                    let data = rows[0];
                    console.log(password, '::', data.password.toString())
                    let valid = await bcrypt.compare(password, data.password.toString());
                    if (valid) {
                        // send successful user login info sans password hash
                        data.password = undefined
                        res.send(data);
                    }
                    else {
                        // user not found or password incorrect
                        res.sendStatus(404);
                    }
                }
            }
        })
    }
})


module.exports = router