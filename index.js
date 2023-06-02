const express = require('express');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT | 3000;

const app = express();
app.use(express.json());
app.use(express.static('./'));

//middleware for cookies
app.use(cookieParser());

// Middlewares
const checkUser = require('./middlewares/checkUser.js')
const validarUserInfo = require('./middlewares/validarUserInfo.js')

// Controllers
const handleLogin = require('./controllers/auth/handleLogin.js')
const handleRegister = require('./controllers/auth/handleRegister.js')
const handleRefreshToken = require('./controllers/auth/handleRefreshToken.js')
const handleLogout = require('./controllers/auth/handleLogout.js')
const getPagos = require('./controllers/pagos/getPagos.js')
const addPago = require('./controllers/pagos/addPago.js')
const updatePago = require('./controllers/pagos/updatePago.js')
const deletePago = require('./controllers/pagos/deletePago.js')
const getPlazosFijos = require('./controllers/plazos-fijos/getPlazosFijos.js')
const addPlazoFijo = require('./controllers/plazos-fijos/addPlazoFijo.js')
const updatePlazoFijo = require('./controllers/plazos-fijos/updatePlazoFijo.js')
const deletePlazoFijo = require('./controllers/plazos-fijos/deletePlazoFijo.js')

const updateFirstName = require('./controllers/auth/updateFirstName.js')
const updateLastName = require('./controllers/auth/updateLastName.js')
const updateEmail = require('./controllers/auth/updateEmail.js')

app.get('/', (req, res) => {
  res.sendFile('./index.html', { root: './public' });
});

app.get('/home', (req, res) => {
  res.sendFile('./home.html', { root: './public' });
})

app.get('/register', (req, res) => {
  res.sendFile('./register.html', { root: './public' });
})

app.post('/', handleLogin) 
app.post('/register', validarUserInfo, handleRegister)
app.post('/token', handleRefreshToken)
app.delete('/logout', handleLogout)

app.post('/config/firstName/', updateFirstName)
app.post('/config/lastName/', updateLastName)
app.post('/config/email/', updateEmail)

app.get('/pagos/', checkUser, getPagos);
app.post('/pagos/', checkUser, addPago);
app.put('/pagos/:id', checkUser, updatePago);
app.delete('/pagos/:id', checkUser, deletePago);

app.get('/plazos-fijos/', getPlazosFijos);
app.post('/plazos-fijos/', addPlazoFijo);
app.put('/plazos-fijos/:id', updatePlazoFijo);
app.delete('/plazos-fijos/:id', deletePlazoFijo);

app.all('*', (req, res) => {
  res.status(404)
  res.sendFile('./notfound.html', { root: './public' });
})

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});