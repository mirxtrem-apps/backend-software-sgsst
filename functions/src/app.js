require('dotenv').config();
const express = require('express');
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

app.use('/v1/admin', adminRouter);
app.use('/v1/auth', authRouter);
app.use('/v1/account', empresasRouter);
app.use('/v1/sgsst', sgsstRouter);

module.exports = app;