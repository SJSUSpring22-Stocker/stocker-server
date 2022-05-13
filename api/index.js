const { Router } = require('express')
const axios = require('axios')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('stocker.db');

const router = Router()

let stock_pool = null

((async () => {
    let res = await axios.get('https://query1.finance.yahoo.com/v1/finance/trending/US?count=100')
})());

router.get('/stock', (req, res) => {

})


router.post('/selection', (req, res) => {

})


module.exports = router