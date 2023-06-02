var { mp_findAll } = require('../../database.js')

function getPagos(req, res) {
  // const user = req.headers['authorization']
  const user = req.user
  // console.log(user)

  mp_findAll('pagos')
    .then((resultado) => {
      // Ordenar por Fecha
      const resOrdenado = resultado.sort( (a, b) => {
        const aDate = new Date(a.fecha);
        const bDate = new Date(b.fecha);
        return bDate - aDate;
      });
      
      res.send(resOrdenado.filter(element => element.user === user.name));
    })
    .catch((error) => {
      res.status(500)
      res.send({ message: `Hubo un error al obtener los paros del usuario ${user}.`})
    })
}

module.exports = getPagos