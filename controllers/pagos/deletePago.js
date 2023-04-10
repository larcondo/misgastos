var { mp_deleteOne } = require('../../database.js')

function deletePago(req, res) {
  const id = req.params.id;

  mp_deleteOne('pagos', id)
    .then((resultado) => {
      res.send({ message: 'Eliminado correctamente: ' + id});
    })
    .catch((error) => {
      res.send({ message: 'Hubo un error al eliminar.'});
    })
}

module.exports = deletePago