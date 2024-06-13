var express = require('express');
var router = express.Router();
const url = "https://special-telegram-v49jrjqj9r9fxx9q-4000.app.github.dev/users/"

/* GET users listing. */
router.get('/', function(req, res, next) { 

  fetch(url,{ method: 'GET'})
  .then(async (res) => {
    if(!res.ok){
      const err = await res.json()
      throw err
    }
    return res.json()
  })
  .then((users) => {
    let title = "Gestão de Usuários"
    let cols = ["Id","Login", "Senha", "Email", "Tipo", "Ações"]
    res.render('users', {title, users, cols, error:""});
  })
  .catch((error) => {
    console.log(error)
    res.render('users', {title: "Gestão de Usuários", error });
  })
});


//POST para novo usuário
router.post("/",(req, res) => {
  const { login, senha, email, tipo } = req.body
  fetch(url+'/register', {
    method: "POST",
    headers: {"Content-Type" : "application/json"},
    body: JSON.stringify({ login, senha, email, tipo })
  }).then(async (res) => {
    if(!res.ok){
      const err = await res.json()
      throw err
    }
    return res.json()
  })
  .then((user) => {
    res.send(user);
  })
  .catch((error) => {
    console.log(error)
    res.status(500).send(error);
  })
})

//UPDATE para novo usuário
router.put("/:id",(req, res) => {
  const { id } = req.params
  const { login, senha, email, tipo } = req.body
  fetch(url + id, {
    method: "PUT",
    headers: {"Content-Type" : "application/json"},
    body: JSON.stringify({ login, senha, email, tipo })
  }).then(async (res) => {
    if(!res.ok){
      const err = await res.json()
      throw err
    }
    return res.json()
  })
  .then((user) => {
    res.send(user);
  })
  .catch((error) => {
    console.log(error)
    res.status(500).send(error);
  })
})

//DELETE do usuário
router.delete("/:id",(req, res) => {
  const { id } = req.params  
  fetch(url + id, {
    method: "DELETE",
  }).then(async (res) => {
    if(!res.ok){
      const err = await res.json()
      throw err
    }
    return res.json()
  })
  .then((user) => {
    res.send(user);
  })
  .catch((error) => {
    console.log(error)
    res.status(500).send(error);
  })
})

//GET usuário por id
router.get("/:id",(req, res) => {
  const { id } = req.params  
  fetch(url + id, {
    method: "GET",
  }).then(async (res) => {
    if(!res.ok){
      const err = await res.json()
      throw err
    }
    return res.json()
  })
  .then((user) => {
    res.send(user);
  })
  .catch((error) => {
    console.log(error)
    res.status(500).send(error);
  })
})





module.exports = router;
