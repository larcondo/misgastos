var { mp_findAll } = require('../../database.js')
const bcrypt = require('bcrypt')
const getUserData = require('../../helpers/getUserData.js')

function handleLogin(req, res) {
  
  const user = req.body

  mp_findAll('usermng')
    .then(async (response) => {
      const userData = getUserData(user, response)
      if(userData === undefined){
        // El usuario no está registrado
        res.send({ error: 'user', message: 'El usuario con ese nombre NO existe!'})
      }
      
      try {
        if( await bcrypt.compare(user.password, userData.password)){
          // success
          const {_id, password, ...info} = userData
          res.send({ message: 'Login correcto', info})
        } else {
          // Not allowed
          res.send({ error: 'password', message: 'El password es incorrecto!'})
        }
      } catch {
        res.send({ error: 'Hubo un error en el servidor'})
      }
    })
    .catch((err) => {
      console.log(err)
      res.send({ error: 'Hubo un error en el login'})
    })
}

module.exports = handleLogin