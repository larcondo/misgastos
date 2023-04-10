const express = require('express');
const PORT = process.env.PORT | 3000;

const app = express();
app.use(express.json());
app.use(express.static('./'));

// Middlewares
const checkUser = require('./middlewares/checkUser.js')
const validarUserInfo = require('./middlewares/validarUserInfo.js')

// Controllers
const handleLogin = require('./controllers/auth/handleLogin.js')
const handleRegister = require('./controllers/auth/handleRegister.js')
const getPagos = require('./controllers/pagos/getPagos.js')
const addPago = require('./controllers/pagos/addPago.js')
const updatePago = require('./controllers/pagos/updatePago.js')
const deletePago = require('./controllers/pagos/deletePago.js')
const getPlazosFijos = require('./controllers/plazos-fijos/getPlazosFijos.js')
const addPlazoFijo = require('./controllers/plazos-fijos/addPlazoFijo.js')
const updatePlazoFijo = require('./controllers/plazos-fijos/updatePlazoFijo.js')
const deletePlazoFijo = require('./controllers/plazos-fijos/deletePlazoFijo.js')

app.get('/', (req, res) => {
  res.sendFile('./index.html', { root: './public' });
});

app.post('/login', handleLogin) 
app.post('/register', validarUserInfo, handleRegister)

app.get('/pagos/', checkUser, getPagos);
app.post('/pagos/', addPago);
app.put('/pagos/:id', updatePago);
app.delete('/pagos/:id', deletePago);

app.get('/plazos-fijos/', getPlazosFijos);
app.post('/plazos-fijos/', addPlazoFijo);
app.put('/plazos-fijos/:id', updatePlazoFijo);
app.delete('/plazos-fijos/:id', deletePlazoFijo);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});