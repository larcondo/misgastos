const bcrypt = require('bcrypt')
var { mp_insertOne } = require('../../database.js')

async function handleRegister(req, res) {
  
  const userInfo = req.body
  userInfo.role = 'Basic'

  try {
    const hashedPass = await bcrypt.hash(userInfo.password, 10)
    userInfo.password = hashedPass
    
    mp_insertOne('usermng', userInfo)
    .then(() => res.send({ message: 'Usuario registrado correctamente'}))
    .catch(() => res.send({ message: 'Hubo un error al registrar el usuario'}))

  } catch {
    res.send({ message: 'Hubo un error al registrar el usuario'})
  }
}

module.exports = handleRegister