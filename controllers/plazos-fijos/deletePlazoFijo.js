var { mp_deleteOne } = require('../../database.js')

function deletePlazoFijo(req, res) {
  
  const id = req.params.id;

  mp_deleteOne('plazosfijos', id)
    .then((resultado) => {
      res.send({ message: 'Eliminado correctamente: ' + id});
    })
    .catch((error) => {
      res.send({ message: 'Hubo un error al eliminar.'});
    })
}

module.exports = deletePlazoFijo