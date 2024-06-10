var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3")

const db = new sqlite3.Database('./database/database.db')

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  login TEXT UNIQUE,
  senha TEXT,
  email TEXT UNIQUE,
  tipo TEXT
)`, (err) => {
  if (err) {
    console.error('Erro ao criar a tabela users: ', err);
  } else {
    console.log ('Tabela users criada com sucesso')
  }
});

router.post('/register', (req, res) =>{
  const { login, senha, email, tipo} = req.body   
  console.log(req.body)
  db.run('INSERT INTO users (login, senha, email, tipo) VALUES (?,?,?,?)', [login, senha, email, tipo],(err)=>{
    if (err){
      console.log("Erro ao criar usuário", err)
      return res.status(500).send({error: 'Erro ao criar usuário'})
    } else {
      res.status(201).send({message:"Usuário criado com sucesso"})
    }
  })
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.all('SELECT * FROM users', (err,users)=>{
    if(err){
      console.log("Usuários não foram encontrados", err)
      return res.status(500).send({error: "Usuário não encontrados"})
    } else {
      res.status(200).send(users)
    }
  })
});

module.exports = router;
