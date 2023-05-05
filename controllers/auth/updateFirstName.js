var { mp_findAll, mp_updateOne } = require('../../database.js')
const bcrypt = require('bcrypt')

function updateFirstName(req, res) {

  // Chequeo si el usuario existe en un middleware

  const password = req.headers['authorization'].split(' ')[1]
  const firstName = req.body.firstName
  const userName = req.body.userName

  console.log(req.headers['authorization'])

  if (!req.body.firstName) {
    res.status(400).send({ message: 'firstName REQUERIDO' })
    return
  }

  mp_findAll('usermng')
    .then( async (response) => {
      const userExist = response.some( user => user.name === userName )

      if (userExist) {
        try {
          const userData = response.filter( user => user.name === userName )
          const userId = userData[0]._id
          const encPassword = userData[0].password

          if( await bcrypt.compare(password, encPassword)) {
            mp_updateOne('usermng', userId, {firstName: firstName})
              .then((resultado) => {
                res.status(200).send({ message: 'Nombre de usuario actualizado correctamente' })
              })
              .catch((err) => {
                console.log(err)
                res.status(500).send({ message: 'Hubo un error al actualizar el nombre en la base de datos'})
              })
          } else {
            res.status(403).send({ message: 'El password es INCORRECTO'})
          }

        } catch {
          res.status(500).send({ message: 'Error al verificar el usuario'})
        }
      } else {
        res.status(400).send({ message: 'El usuario NO existe' })
      }

    })
    .catch( (err) => {
      console.log(err)
      res.status(500).send({ error: 'Hubo un error al actualizar el firstName'})
    })


}

module.exports = updateFirstName