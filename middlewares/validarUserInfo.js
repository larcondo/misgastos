var { mp_findAll } = require('../database.js')
const userExists = require('../helpers/userExists.js')

function validarUserInfo(req, res, next) {
  if(req.body.name && req.body.password && req.body.email) {
    mp_findAll('usermng')
      .then((response) => {
        if (userExists(req.body, response)) {
          res.status(400).send({error: 'El usuario con ese nombre ya existe'})
        } else {
          next()
        }
      })
      .catch((err) => {
        console.log(err)
        res.status(500).send({ error: 'Hubo un error'})
      })
        
  } else {
    res.send({error: 'No estan todos los campos obligatorios!'})
  }  
}

module.exports = validarUserInfo