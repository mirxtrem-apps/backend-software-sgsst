require('dotenv').config();
const express = require('express');
const connection = require('./database/conn');
const query = require('./helpers/promise_conn');
const adminRouter = require('./routes/admin.routes');
const empresasRouter = require('./routes/account.routes');
const authRouter = require('./routes/auth.routes');
const sgsstRouter = require('./routes/sgsst.routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/test', (req, res) => {
    res.status(200).json({data: 'Hola desde el servidor'})
});

app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/account', empresasRouter);
app.use('/api/v1/sgsst', sgsstRouter);

app.set('port', 3000);

app.listen(app.get('port'), () => {
    console.log('Escuchando en el puerto 3000')
});

module.exports = connection;