var { mp_updateOne } = require('../../database.js')

function updatePago(req, res) {
  const id = req.params.id;
  const body = req.body;

  mp_updateOne('pagos', id, body)
    .then((resultado) => {
      res.send({ message: 'Actualizado correctamente.', body});
    })    
    .catch((error) => {
      res.send({ message: 'Hubo un error al actualizar.' });
    })
}

module.exports = updatePago