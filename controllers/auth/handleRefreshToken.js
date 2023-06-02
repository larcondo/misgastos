require('dotenv').config()
const jwt = require('jsonwebtoken')
const { generateAccessToken } = require('../../helpers/generateTokens')

function handleRefreshToken(req, res) {
  
  // const refreshToken = req.body.refresh
  const cookies = req.cookies
  if (!cookies?.jwtr) return res.sendStatus(401);
  const refreshToken = cookies.jwtr;
  if (refreshToken == null) return res.sendStatus(401)
  
  // if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    // res.cookie('jwta', accessToken, { httpOnly: true, secure: true, maxAge: 60 * 60 * 1000 });
    // res.json({ result: 'OK - You have a new accessToken' })
    res.json({ accessToken: accessToken, expiresIn: 60 })
  })
}

module.exports = handleRefreshToken