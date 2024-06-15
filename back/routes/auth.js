var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3");
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

const db = new sqlite3.Database('./database/database.db')

router.post('/login', (req, res) => {
    const { login, senha } = req.body
    db.get('SELECT * FROM users WHERE login = ?', login, (err, row) => {
        if (!row) {
            console.log("Usuário não encontrado", err)
            return res.status(404).send({ error: 'Usuário não encontrado' })
        } else {
            bcrypt.compare(senha, row.senha, (err, result) => {
                if (err) { 
                    console.log("Erro ao comparar as senhas", err)
                    return res.status(500).send({ error: 'Erro ao comparar as senhas' })
                } else if (!result) {
                    return res.status(401).send({ error: 'Senha incorreta' })
                } else {
                    const token = jwt.sign({ id: row.id }, '881fca48c92a98295aaaeee18c6f1425d00f59298f0b085a01c51cb2329d4cb2', { expiresIn: '1h' }) 
                    return res.status(200).send({ message: 'Login com sucesso', token })
                }
            })
        }
    })
})

module.exports = router;