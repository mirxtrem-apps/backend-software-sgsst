const express = require('express');
const query = require("../helpers/promise_conn");

const sgsstRouter = express.Router();

sgsstRouter.get('/sgsst/evaluaciones',()=>{
    // Retorna todas las evaliaciones
    // TODO: SELECT a la tabla evaluaciones 
});
sgsstRouter.get('/sgsst/evaluaciones/:id',()=>{
    // Retorna 1 evaluacion por ID
    // Exite ese en ID en la tabla?
    // TODO: SELECT con un WHERE

});
sgsstRouter.post('/sgsst/evaluaciones',()=>{
    // INSERT  
});
sgsstRouter.put('/sgsst/evaluaciones/:id',()=>{
    // UPDATE
});
sgsstRouter.delete('/sgsst/evaluaciones/:id',()=>{
    // DELETE
});

sgsstRouter.get('/sgsst/clasificaciones',()=>{});
sgsstRouter.get('/sgsst/clasificaciones/:id',()=>{});
sgsstRouter.post('/sgsst/clasificaciones',()=>{});
sgsstRouter.put('/sgsst/clasificaciones/:id',()=>{});
sgsstRouter.delete('/sgsst/clasificaciones/:id',()=>{});

module.exports = sgsstRouter;