require('dotenv').config();
const express = require('express');
const cors = require('cors');

const adminRouter = require('./src/routes/admin.routes');
const empresasRouter = require('./src/routes/account.routes');
const authRouter = require('./src/routes/auth.routes');
const sgsstRouter = require('./src/routes/sgsst.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/test', (req, res) => {
    res.status(200).json({data: 'Hola desde el servidor'});
});

app.use('/v1/admin', adminRouter);
app.use('/v1/auth', authRouter);
app.use('/v1/account', empresasRouter);
app.use('/v1/sgsst', sgsstRouter);

app.set('port', process.env.PORT);

app.listen(app.get('port'), () => {
    console.log('Escuchando en el puerto', app.get('port'))
});