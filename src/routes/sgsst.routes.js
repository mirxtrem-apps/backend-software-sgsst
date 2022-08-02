const express = require("express");
const query = require("../helpers/promise_conn");

const sgsstRouter = express.Router();

// RESPONSABLE SST
sgsstRouter.get("/:nit/responsables-sst/", async (req, res) => {
  const { nit } = req.params;
  try {
    const empresas = await query(
      `SELECT * FROM empresas WHERE nit=${nit} LIMIT 1`
    );
    if (empresas.length != 0) {
      const response = await query(
        `SELECT * FROM responsables_sst WHERE empresa_id=${nit}`
      );
      return res.status(200).json({
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
sgsstRouter.get("/:nit/responsables-sst/:id", async (req, res) => {
  const { nit, id } = req.params;
  try {
    const empresas = await query(
      `SELECT * FROM empresas WHERE nit=${nit} LIMIT 1`
    );
    if (empresas.length != 0) {
      const response = await query(
        `SELECT * FROM responsables_sst WHERE empresa_id=${nit} AND id=${id} LIMIT 1`
      );
      if (response.length != 0) {
        return res.status(200).json({
          ok: true,
          data: response[0],
          error: "",
        });
      }
      return res.status(404).json({
        ok: false,
        data: [],
        error: "No existe este responsable SST en el sistema.",
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
sgsstRouter.post("/:nit/responsables-sst", async (req, res) => {
  const { nit } = req.params;
  const { nombres, apellidos, cedula, tipo_responsable_id } = req.body;
  try {
    const empresas = await query(
      `SELECT * FROM empresas WHERE nit=${nit} LIMIT 1`
    );
    if (empresas.length != 0) {
      const response = await query(
        `INSERT INTO responsables_sst (nombres, apellidos, cedula, empresa_id, tipo_responsable_id) 
                VALUES("${nombres}", "${apellidos}", "${cedula}", ${nit}, ${tipo_responsable_id})`
      );
      return res.status(200).json({
        ok: true,
        data: {
          id: response.insertId,
          message: "Responsable SST creado éxitosamente.",
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
sgsstRouter.put("/:nit/responsables-sst/:id", async (req, res) => {
  const { nit, id } = req.params;
  const { nombres, apellidos, cedula, tipo_responsable_id } = req.body;
  try {
    const empresas = await query(
      `SELECT * FROM empresas WHERE nit=${nit} LIMIT 1`
    );
    if (empresas.length != 0) {
      const response = await query(
        `SELECT * FROM responsables_sst WHERE id=${id} AND empresa_id=${nit} LIMIT 1`
      );
      if (response.length != 0) {
        await query(
          `UPDATE responsables_sst 
                  SET nombres= '${nombres}',
                  apellidos= '${apellidos}',
                  cedula= '${cedula}',
                  empresa_id= ${nit},
                  tipo_responsable_id= ${tipo_responsable_id}
                  WHERE id= ${id}`
        );
        return res.status(200).json({
          ok: true,
          data: {
            message: "Responsable SST actualizado exitosamente.",
          },
          error: "",
        });
      }
      return res.status(404).json({
        ok: false,
        data: [],
        error: "No existe esta empresa en el sistema.",
      });
    } else {
      return res.status(404).json({
        ok: false,
        data: [],
        error: "No existe estos datos en el sistema.",
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
sgsstRouter.delete("/:nit/responsables-sst/:id", async (req, res) => {
  const { nit, id } = req.params;
  try {
    const empresas = await query(
      `SELECT * FROM empresas WHERE nit=${nit} LIMIT 1`
    );
    if (empresas.length != 0) {
      const response = await query(
        `SELECT * FROM responsables_sst WHERE id=${id} AND empresa_id=${nit} LIMIT 1`
      );
      if (response.length != 0) {
        await query(`DELETE FROM responsables_sst WHERE id=${id}`);
        return res.status(200).json({
          ok: true,
          data: {
            message: "Responsable SST eliminado éxitosamente.",
          },
          error: "",
        });
      }
      return res.status(404).json({
        ok: false,
        data: [],
        error: "No existe este responsable SST en el sistema.",
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
sgsstRouter.delete("/:nit/responsables-sst", async (req, res) => {
  const { nit } = req.params;
  try {
    const empresas = await query(
      `SELECT * FROM empresas WHERE nit=${nit} LIMIT 1`
    );
    if(empresas.length != 0) {
        await query(`DELETE FROM responsables_sst WHERE empresa_id=${nit}`);
        return res.status(200).json({
          ok: true,
          data: {
            message: "Responsables SST eliminados éxitosamente.",
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

// CLASIFICACIONES
sgsstRouter.get("/clasificaciones", async (req, res) => {
  // TODO; recibir un token y sacarle el nit
  const { num_empleados, nivel_riesgo, tipo_evaluacion_id, tipo_responsable_id, empresa_id, num_estandares } = req.body;
  try {
    const empresas = await query(
      `SELECT * FROM empresas WHERE nit=${empresa_id} LIMIT 1`
    );
    if (empresas.length != 0) {
      const response = await query(
        `SELECT * FROM clasificaciones WHERE empresa_id=${empresa_id}`
      );
      return res.status(200).json({
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
sgsstRouter.get("/clasificaciones/:id", () => {
  // TODO: Retorna una clasificación
});
sgsstRouter.post("/clasificaciones", () => {
  // TODO: Crea una nueva clasificación
});
sgsstRouter.put("/clasificaciones/:id", () => {
  // TODO: Actualiza una clasificación
});
sgsstRouter.delete("/clasificaciones/:id", () => {
  // TODO: Elimina una clasificación
});

// EVALUACIONES
sgsstRouter.get("/evaluaciones", () => {
  // TODO: Listar todas las evaluaciones
});
sgsstRouter.get("/evaluaciones/:id", () => {
  // TODO: Obtiene una evaluación
});
sgsstRouter.post("/evaluaciones", () => {
  // TODO. Crea una evaluación
});
sgsstRouter.put("/evaluaciones/:id", () => {
  // TODO: actualiza una evaluación ( método deshabilitado )
});
sgsstRouter.delete("/evaluaciones/:id", () => {
  // TODO: Elimina una evaluacuón
});

module.exports = sgsstRouter;
