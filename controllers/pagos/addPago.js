var { mp_insertOne } = require('../../database.js')

function addPago(req, res) {
  const objectBody = req.body;

  if(typeof(objectBody.importe) !== 'number') {
    res.send({ message: 'Tipo erróneo de <importe>. Debe ser: numero.'})
    return
  }

  mp_insertOne('pagos', objectBody)
    .then((resultado) => {
      res.send({ message: 'Insertado correctamente', objectBody});
    })
    .catch((error) => {
      res.send({ message: 'Hubo un error al insertar.'});
    })
}

module.exports = addPago