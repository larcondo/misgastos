var { mp_findAll, mp_insertOne } = require('../../database.js')
const bcrypt = require('bcrypt')
const getUserData = require('../../helpers/getUserData.js')
const { generateAccessToken, generateRefreshToken } = require('../../helpers/generateTokens.js')

function handleLogin(req, res) {
  
  const user = req.body

  mp_findAll('usermng')
    .then(async (response) => {
      const userData = getUserData(user, response)
      if(userData === undefined){
        // El usuario no está registrado
        res.status(400)
        res.send({ error: 'user', message: 'El usuario con ese nombre NO existe!'})
        return
      }
      
      try {
        if( await bcrypt.compare(user.password, userData.password)){
          // success
          const accessToken = generateAccessToken({ name: user.name })
          const refreshToken = generateRefreshToken({ name: user.name })

          // Guardar en BD el refresh token
          mp_insertOne('refreshtokens', { name: user.name, refreshToken: refreshToken })
          .catch( err => console.log(err))

          const {_id, password, ...info} = userData
          // refresh token
          res.cookie('jwtr', refreshToken, { 
            httpOnly: true, 
            secure: true, 
            maxAge: 60 * 60 * 1000 
          });
          // access token
          res.send({ message: 'Login successfull', accessToken: accessToken, info})
        } else {
          // Not allowed
          res.status(401)
          res.send({ error: 'password', message: 'Wrong Password'})
        }
      } catch {
        res.status(500)
        res.send({ error: 'Hubo un error en el servidor'})
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(500)
      res.send({ error: 'Hubo un error en el login'})
    })
}

module.exports = handleLogin