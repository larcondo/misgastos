var { mp_findAll, mp_updateOne } = require('../../database.js')
const bcrypt = require('bcrypt')

function updateEmail(req, res) {
  
  // Chequeo si el usuario existe en un middleware

  const password = req.headers['authorization'].split(' ')[1]
  const email = req.body.email
  const userName = req.body.userName
  const emailRegex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'gm')
  const isValidEmail = emailRegex.test(email)

  if (!req.body.email) {
    res.status(400).send({ message: 'email REQUERIDO' })
    return
  }

  if (!isValidEmail) {
    res.status(400).send({ message: 'email INVALIDO'})
    return
  }


  mp_findAll('usermng')
    .then( async (response) => {
      const userExist = response.some( user => user.name === userName )

      if (userExist) {
        const userData = response.filter( user => user.name === userName )
        const userId = userData[0]._id
        const encPassword = userData[0].password

        if( await bcrypt.compare(password, encPassword)) {
          mp_updateOne('usermng', userId, {email: email})
            .then((resultado) => {
              res.status(200).send({ message: 'E-mail de usuario actualizado correctamente', resultado })
            })
            .catch((err) => {
              console.log(err)
              res.status(500).send({ message: 'Hubo un error al actualizar el E-mail en la base de datos'})
            })
        } else {
          res.status(403).send({ message: 'El password es INCORRECTO'})
        }

      } else {
        res.status(400).send({ message: 'El usuario NO existe' })
      }
    })
    .catch( (err) => {
      console.log(err)
      res.status(500).send({ error: 'Hubo un error al actualizar el E-mail'})
    })

}

module.exports = updateEmail