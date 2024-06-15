var express = require('express');
var router = express.Router();

const url = "https://special-telegram-v49jrjqj9r9fxx9q-4000.app.github.dev/auth/login"

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('layout', { body: 'pages/login', title: 'Express' });
});

router.post('/login', (req, res) => {
    const { login, senha } = req.body
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, senha })
    })
        .then(async (res) => {
            if (!res.ok) {
                const err = await res.json()
                throw err
            }
            return res.json()
        })
        .then((data) => {
            req.session.token = data.token
            res.redirect('/users')
        })
        .catch((error) => {
            res.render('layout', { body: 'pages/login', title: 'Express', error })
        })
})

module.exports = router;
