var express = require('express');
var router = express.Router();
const url = "https://special-telegram-v49jrjqj9r9fxx9q-4000.app.github.dev/users"

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

router.post("/",(req, res) => {
  console.log(req.body)
})

module.exports = router;
