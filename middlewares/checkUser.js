function checkUser(req, res, next) {
  const auth = req.headers['authorization']
  
  // if(!auth) {
  //   res.status(403)
  //   res.send({ error: 'El usuario no es válido.'})
  // } else {
  //   next()
  // }
  next()
}

module.exports = checkUser