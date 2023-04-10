var { mp_findAll } = require('../../database.js')

function getPlazosFijos(req, res) {
  
  mp_findAll('plazosfijos')
  .then((resultado) => {
    // Ordenar por Fecha Alta
    const resOrdenado = resultado.sort((a, b) => {
      const aDate = new Date(a.fechaAlta);
      const bDate = new Date(b.fechaAlta);

      return bDate - aDate;
    });
    res.send(resOrdenado);
  })
  .catch((error) => {
    res.send({ message: 'Hubo un error.'});
  })

}

module.exports = getPlazosFijos