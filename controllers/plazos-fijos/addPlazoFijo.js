var { mp_insertOne } = require('../../database.js')

function addPlazoFijo(req, res) {

  const objectBody = req.body;

  mp_insertOne('plazosfijos', objectBody)
    .then((resultado) => {
      res.send({ message: 'Insertado correctamente', objectBody});
    })
    .catch((error) => {
      res.send({ message: 'Hubo un error al insertar.'});
    })

}

module.exports = addPlazoFijo