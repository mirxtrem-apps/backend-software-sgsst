const express = require('express');
const query = require("../helpers/promise_conn");

const sgsstRouter = express.Router();

sgsstRouter.get('/sgsst/evaluaciones',()=>{});
sgsstRouter.get('/sgsst/evaluaciones/:id',()=>{});
sgsstRouter.post('/sgsst/evaluaciones',()=>{});
sgsstRouter.put('/sgsst/evaluaciones/:id',()=>{});
sgsstRouter.delete('/sgsst/evaluaciones/:id',()=>{});

sgsstRouter.get('/sgsst/clasificaciones',()=>{});
sgsstRouter.get('/sgsst/clasificaciones/:id',()=>{});
sgsstRouter.post('/sgsst/clasificaciones',()=>{});
sgsstRouter.put('/sgsst/clasificaciones/:id',()=>{});
sgsstRouter.delete('/sgsst/clasificaciones/:id',()=>{});

module.exports = sgsstRouter;