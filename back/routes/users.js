var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3");
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

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
    console.log('Tabela users criada com sucesso')
  }
});

//Rota para salvar um novo usuário
router.post('/register', (req, res) => {
  console.log(req.body)
  const { login, senha, email, tipo } = req.body

  db.get('SELECT * FROM users WHERE login = ?', login, (err, row) => {
    if (row) {
      console.log("Usuário já existe", row)
      return res.status(400).send({ error: "Login de usuário já existe" })
    } else {

      bcrypt.hash(senha, 10, (err, hash) => {
        if (err) {
          console.log("Erro ao criar o hash da senha", err)
          return res.status(500).send({ error: 'Erro ao criar o hash da senha' })
        } else {
          db.run('INSERT INTO users (login, senha, email, tipo) VALUES (?,?,?,?)', [login, hash, email, tipo], (err) => {
            if (err) {
              console.log("Erro ao criar usuário", err)
              return res.status(500).send({ error: 'Erro ao criar usuário' })
            } else {
              res.status(201).send({ message: "Usuário criado com sucesso" })
            }
          })
        }
      })
    }
  })
})

  /* GET users listing. */
  router.get('/', function (req, res, next) {
    db.all('SELECT * FROM users', (err, users) => {
      if (err) {
        console.log("Usuários não foram encontrados", err)
        return res.status(500).send({ error: "Usuário não encontrados" })
      } else {
        res.status(200).send(users)
      }
    })
  });

  /* GET pelo ID */
  router.get('/:id', function (req, res, next) {
    const { id } = req.params;
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Usuário não encontrado', err);
        return res.status(500).json({ error: 'Usuário não encontrado' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      res.status(200).json(row);
    });
  });

  //Put para atualizar usuário
  router.put('/:id', function (req, res, next) {
    const { id } = req.params;
    const { login, senha, email, tipo } = req.body
    db.run('UPDATE users SET login = ?, senha = ?, email = ?, tipo = ? WHERE id = ?', [login, senha, email, tipo, id], function (err) {
      if (err) {
        console.error('Erro ao atualizar usuário', err);
        return res.status(500).json({ error: 'Erro ao atualizar usuário' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      res.status(200).json({ message: "Usuário finalizado com sucesso" });
    });
  });

  //PATCH para atualizar uma parte do usuário
  router.patch('/:id', function (req, res, next) {
    const { id } = req.params;
    const fields = req.body;
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    if (keys.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo fornecido para atualização' });
    }

    const setClause = keys.map((key) => `${key} = ?`).join(', ');

    db.run(`UPDATE users SET ${setClause} WHERE id = ?`, [...values, id], function (err) {
      if (err) {
        console.error('Erro ao atualizar o usuário parcialmente', err);
        return res.status(500).json({ error: 'Erro ao atualizar o usuário parcialmente' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      res.status(200).json({ message: "Usuário atualizao parcialmente com sucesso" });
    });
  });

  //DELETE para deletar o usuário
  router.delete('/:id', function (req, res, next) {
    const { id } = req.params;
    db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
      if (err) {
        console.error('Erro ao deletar o usuário', err)
        return res.status(500).json({ error: 'Erro ao deletar usuário' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      res.status(200).json({ message: "Usuário deletado com sucesso" });
    });
  });

  module.exports = router;
