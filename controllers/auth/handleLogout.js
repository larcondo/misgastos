var { mp_delete } = require('../../database.js')

function handleLogout(req, res) {

  // const refreshToken = req.body.refresh
  const cookies = req.cookies
  if (!cookies?.jwtr) return res.sendStatus(401);
  const refreshToken = cookies.jwtr;
  const userName = req.body.name

  if (refreshToken === null || refreshToken === undefined) {
    res.status(400).send({ message: 'Refresh Token required.'})
    return
  }

  if (userName === null || userName === undefined) {
    res.status(400).send({ message: 'User Name required.'})
    return
  }

  const record = {
    name: userName,
    refreshToken: refreshToken
  }

  mp_delete('refreshtokens', record)
    .then( response => {
      res.clearCookie('jwta', { httpOnly: true, secure: true });
      res.clearCookie('jwtr', { httpOnly: true, secure: true });
      res.status(200).send({ message: 'Logout successfully', response })
    })
    .catch( err => {
      console.log(err)
      res.status(500).send({ message: 'Logout failed in server' })
    })

}

module.exports = handleLogout