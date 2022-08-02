const express = require("express");
const query = require("../helpers/promise_conn");
const account = require("../controllers/account_controller");

const accountController = account({ query });

const empresasRouter = express.Router();


// Amdinistración de empresas
empresasRouter.get("/empresas", async (req, res) => {
  try {
    const response = await query(`SELECT * FROM empresas`);
    res.status(200).json({
      ok: true,
      data: response,
      error: "",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      data: [],
      error: "Error del servidor, intente nuevamente.",
    });
  }
});

empresasRouter.get("/empresas/:nit", async (req, res) => {
  const { nit } = req.params;
  try {
    const response = await query(
      `SELECT * FROM empresas WHERE nit=${nit} LIMIT 1`
    );
    if(response.length != 0) {
      return res.status(200).json({
        ok: true,
        data: response[0],
        error: "",
      });
    }
    return res.status(404).json({
      ok: false,
      data: [],
      error: "No existe esta empresa en el sistema.",
    });
  } catch (error) {
    res.status(200).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});

empresasRouter.post("/empresas", accountController.create);

empresasRouter.put("/empresas/:nit", async (req, res) => {
  const { nit } = req.params;
  const { razon_social, direccion, telefono, cod_ciiu, mineria } = req.body;
  try {
    const response = await query(
      `SELECT * FROM empresas WHERE nit=${nit} LIMIT 1`
    );
    if (response.length != 0) {
      const response = await query(
        `UPDATE empresas 
                SET razon_social='${razon_social}', 
                    direccion='${direccion}', 
                    telefono='${telefono}', 
                    cod_ciiu=${cod_ciiu}, 
                    mineria=${mineria} 
                WHERE nit=${nit}`
      );
      console.log(response);
      res.status(200).json({
        ok: true,
        data: {
          message: "Empresa actualizada con éxito.",
        },
        error: "",
      });
    } else {
      return res.status(404).json({
        ok: false,
        data: [],
        error: "No existe esta empresa en el sistema.",
      });
    }
  } catch (error) {
    return res.status(400).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});
empresasRouter.delete("/empresas/:nit", async (req, res) => {
  const { nit } = req.params;
  try {
    const response = await query(
      `SELECT * FROM empresas WHERE nit='${nit}' LIMIT 1`
    );
    if (response.length != 0) {
      const response = await query(`DELETE FROM empresas WHERE nit=${nit}`);
      res.status(200).json({
        ok: true,
        data: {
          message: "Empresa eliminada con éxito.",
        },
        error: "",
      });
    } else {
      return res.status(404).json({
        ok: false,
        data: [],
        error: "No existe esta empresa en el sistema.",
      });
    }
  } catch (error) {
    return res.status(400).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});

// REPRESENTANTES LEGALES
empresasRouter.get("/empresas/:nit/representante-legal", async (req, res) => {
  const { nit } = req.params;
  try {
    const empresas = await query(
      `SELECT * FROM empresas WHERE nit=${nit} LIMIT 1`
    );
    if(empresas.length != 0) {
      const response = await query(`SELECT * FROM representantes_legales WHERE empresa_id=${nit}`);
      res.status(200).json({
        ok: true,
        data: response,
        error: "",
      });
    }
    return res.status(404).json({
      ok: false,
      data: [],
      error: "No existe esta empresa en el sistema.",
    });
  } catch (error) {
    console.log(error);
    const message = error.sqlMessage;
    res.status(400).json({
      ok: false,
      data: [],
      error: `Error del servidor, ${message}.`,
    });
  }
});
empresasRouter.get("/empresas/:nit/representante-legal/:id", async (req, res) => {
  const { nit, id } = req.params;
  try {
    const empresas = await query(
      `SELECT * FROM empresas WHERE nit=${nit} LIMIT 1`
    );
    if(empresas.length != 0) {
      const response = await query(
        `SELECT * FROM representantes_legales WHERE empresa_id=${nit} AND id=${id} LIMIT 1`
      );
      if(response.length != 0) {
        return res.status(200).json({
          ok: true,
          data: response[0],
          error: "",
        });
      }
      return res.status(404).json({
        ok: false,
        data: [],
        error: "No existe estos datos en el sistema.",
      });
    }
    return res.status(404).json({
      ok: false,
      data: [],
      error: "No existe esta empresa en el sistema.",
    });
  } catch (error) {
    res.status(200).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});
empresasRouter.post("/empresas/:nit/representante-legal", async (req, res) => {
  const { nit } = req.params;
  const { nombres, apellidos, cedula } = req.body;
  try {
    const empresas = await query(
      `SELECT * FROM empresas WHERE nit=${nit} LIMIT 1`
    );
    if(empresas.length != 0) {
      const response = await query(
        `INSERT INTO representantes_legales (nombres, apellidos, cedula, empresa_id) 
            VALUES("${nombres}", "${apellidos}", "${cedula}", ${nit})`
      );
      return res.status(200).json({
        ok: true,
        data: {
          id: response.insertId,
          message: "Representante legal creado éxitosamente.",
        },
        error: "",
      });
    }
    return res.status(404).json({
      ok: false,
      data: [],
      error: "No existe esta empresa en el sistema.",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});
empresasRouter.put("/empresas/:nit/representante-legal/:id", async (req, res) => {
  const { nit, id } = req.params;
  const { nombres, apellidos, cedula } = req.body;
  try {
    const empresas = await query(
      `SELECT * FROM empresas WHERE nit=${nit} LIMIT 1`
    );
    if(empresas.length != 0) {
      const response = await query(
        `SELECT * FROM representantes_legales WHERE id=${id} AND empresa_id=${nit} LIMIT 1`
      );
      if (response.length != 0) {
        await query(
          `UPDATE representantes_legales 
              SET nombres= '${nombres}',
              apellidos= '${apellidos}',
              cedula= '${cedula}',
              empresa_id= ${nit}
              WHERE id= ${id}`
        );
  
        return res.status(200).json({
          ok: true,
          data: {
            message: "Representante legal actualizado exitosamente.",
          },
          error: "",
        });
      } else {
        return res.status(404).json({
          ok: false,
          data: [],
          error: "No existe estos datos en el sistema.",
        });
      }
    }
    return res.status(404).json({
      ok: false,
      data: [],
      error: "No existe esta empresa en el sistema.",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});
empresasRouter.delete("/empresas/:nit/representante-legal/:id", async (req, res) => {
  const { nit, id } = req.params;
  try {
    const empresas = await query(
      `SELECT * FROM empresas WHERE nit=${nit} LIMIT 1`
    );
    if(empresas.length != 0) {      
      const response = await query(
        `SELECT * FROM representantes_legales WHERE id=${id} AND empresa_id=${nit} LIMIT 1`
      );
      if (response.length != 0) {
        await query(`DELETE FROM representantes_legales WHERE id=${id}`);
        return res.status(200).json({
          ok: true,
          data: {
            message: "Representante legal eliminado éxitosamente.",
          },
          error: "",
        });
      } else {
        return res.status(404).json({
          ok: false,
          data: [],
          error: "No existe estos datos legal en el sistema.",
        });
      }
    }
    return res.status(404).json({
      ok: false,
      data: [],
      error: "No existe esta empresa en el sistema.",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});
empresasRouter.delete("/empresas/:nit/representante-legal", async (req, res) => {
  const { nit } = req.params;
  try {
    const empresas = await query(
      `SELECT * FROM empresas WHERE nit=${nit} LIMIT 1`
    );
    if(empresas.length != 0) {
      await query(`DELETE FROM representantes_legales WHERE empresa_id=${nit}`);
      return res.status(200).json({
        ok: true,
        data: {
          message: "Representantes legales eliminados éxitosamente.",
        },
        error: "",
      });
    }
    return res.status(404).json({
      ok: false,
      data: [],
      error: "No existe esta empresa en el sistema.",
    });
  } catch (error) {

    return res.status(400).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});

module.exports = empresasRouter;
