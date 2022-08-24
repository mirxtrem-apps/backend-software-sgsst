const express = require("express");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../helpers/generate_jwt");
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
    if (empresas.length != 0) {
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
  const token = req.headers.authorization;
  if (!token) {
    return res.status(404).json({
      ok: false,
      data: [],
      error: `Acceso no autorizado.`,
    });
  }
  const { uid } = await verifyToken(token);
  try {
    const empresas = await query(
      `SELECT * FROM empresas WHERE nit=${uid} LIMIT 1`
    );
    if (empresas.length != 0) {
      const response = await query(
        `SELECT * FROM clasificaciones WHERE empresa_id=${uid}`
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
sgsstRouter.get("/clasificaciones/:id", async (req, res) => {
  const token = req.headers.authorization;
  const { id } = req.params;

  if (!token) {
    return res.status(404).json({
      ok: false,
      data: [],
      error: `Acceso no autorizado.`,
    });
  }
  const { uid } = await verifyToken(token);
  try {
    const empresas = await query(
      `SELECT * FROM empresas WHERE nit=${uid} LIMIT 1`
    );
    if (empresas.length != 0) {
      const response = await query(
        `SELECT * FROM clasificaciones WHERE id=${id} AND empresa_id=${uid}`
      );
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
    console.log(error);
    const message = error.sqlMessage;
    res.status(400).json({
      ok: false,
      data: [],
      error: `Error del servidor, ${message}.`,
    });
  }
});

sgsstRouter.post("/clasificaciones", async (req, res) => {
  const token = req.headers.authorization;
  const {
    num_empleados,
    nivel_riesgo,
    tipo_evaluacion_id,
    tipo_responsable_id,
    num_estandares,
  } = req.body;

  if (!token) {
    return res.status(404).json({
      ok: false,
      data: [],
      error: `Acceso no autorizado.`,
    });
  }
  const { uid } = await verifyToken(token);
  try {
    const empresas = await query(
      `SELECT * FROM empresas WHERE nit=${uid} LIMIT 1`
    );
    if (empresas.length != 0) {
      const response = await query(
        `INSERT INTO clasificaciones (num_empleados, nivel_riesgo, tipo_evaluacion_id, tipo_responsable_id, empresa_id, num_estandares) VALUES(${num_empleados},${nivel_riesgo},${tipo_evaluacion_id},${tipo_responsable_id}, ${uid}, ${num_estandares})`
      );
      return res.status(200).json({
        ok: true,
        data: {
          id: response.insertId,
          message: "Clasificación creada con éxito.",
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
    const message = error.sqlMessage;
    res.status(400).json({
      ok: false,
      data: [],
      error: `Error del servidor, ${message}.`,
    });
  }
});
sgsstRouter.put("/clasificaciones/:id", async (req, res) => {
  const token = req.headers.authorization;
  const { id } = req.params;
  const {
    num_empleados,
    nivel_riesgo,
    tipo_evaluacion_id,
    tipo_responsable_id,
    num_estandares,
  } = req.body;

  if (!token) {
    return res.status(404).json({
      ok: false,
      data: [],
      error: `Acceso no autorizado.`,
    });
  }
  const { uid } = await verifyToken(token);
  try {
    const empresas = await query(
      `SELECT * FROM empresas WHERE nit=${uid} LIMIT 1`
    );
    if (empresas.length != 0) {
      const response = await query(
        `UPDATE clasificaciones 
        SET num_empleados='${num_empleados}', 
        nivel_riesgo='${nivel_riesgo}', 
        tipo_evaluacion_id='${tipo_evaluacion_id}', 
        tipo_responsable_id=${tipo_responsable_id}, 
        num_estandares=${num_estandares} 
        WHERE id=${id}`
      );
      return res.status(200).json({
        ok: true,
        data: {
          message: "Clasificación actualizada con éxito.",
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
    const message = error.sqlMessage;
    res.status(400).json({
      ok: false,
      data: [],
      error: `Error del servidor, ${message}.`,
    });
  }
});
sgsstRouter.delete("/clasificaciones/:id", async (req, res) => {
  const token = req.headers.authorization;
  const { id } = req.params;

  if (!token) {
    return res.status(404).json({
      ok: false,
      data: [],
      error: `Acceso no autorizado.`,
    });
  }
  const { uid } = await verifyToken(token);
  try {
    const empresas = await query(
      `SELECT * FROM empresas WHERE nit=${uid} LIMIT 1`
    );
    if (empresas.length != 0) {
      const response = await query(
        `DELETE FROM clasificaciones WHERE id=${id}`
      );
      return res.status(200).json({
        ok: true,
        data: {
          message: "Clasificación eliminada con éxito.",
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
    const message = error.sqlMessage;
    res.status(400).json({
      ok: false,
      data: [],
      error: `Error del servidor, ${message}.`,
    });
  }
});

// EVALUACIONES
sgsstRouter.get("/evaluaciones", async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(404).json({
      ok: false,
      data: [],
      error: `Acceso no autorizado.`,
    });
  }
  const { uid } = await verifyToken(token);
  try {
    const empresas = await query(
      `SELECT * FROM empresas WHERE nit=${uid} LIMIT 1`
    );
    if (empresas.length != 0) {
      const response = await query(
        `SELECT * FROM evaluaciones WHERE empresa_id=${uid}`
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

sgsstRouter.post("/evaluaciones", async (req, res) => {
  const token = req.headers.authorization;
  const {
    clasificacion_id,
    puntaje,
    descripcion,
    tipo_valoracion_id,
    cant_estandares_cumplidos,
    cant_estandares_nc,
    cant_estandares_na,
    cant_estandares_justificados,
    finalizada,
  } = req.body;

  if (!token) {
    return res.status(404).json({
      ok: false,
      data: [],
      error: `Acceso no autorizado.`,
    });
  }
  const { uid } = await verifyToken(token);
  try {
    const empresas = await query(
      `SELECT * FROM clasificaciones WHERE id=${clasificacion_id} LIMIT 1`
    );
    if (empresas.length != 0) {
      const response = await query(
        `INSERT INTO 
        evaluaciones 
        (clasificacion_id, 
          puntaje, 
          descripcion, 
          tipo_valoracion_id, 
          cant_estandares_cumplidos, 
          cant_estandares_nc, 
          cant_estandares_na, 
          cant_estandares_justificados, 
          empresa_id, 
          finalizada
          ) VALUES(
            ${clasificacion_id},
            ${puntaje},
            '${descripcion}',
            ${tipo_valoracion_id},
            ${cant_estandares_cumplidos}, 
            ${cant_estandares_nc}, 
            ${cant_estandares_na}, 
            ${cant_estandares_justificados}, 
            ${uid}, 
            ${finalizada})`
      );
      return res.status(200).json({
        ok: true,
        data: {
          id: response.insertId,
          message: "Evaluación creada con éxito.",
        },
        error: "",
      });
    }
    return res.status(404).json({
      ok: false,
      data: [],
      error: "No existe esta clasificación en el sistema.",
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

sgsstRouter.get("/evaluaciones/:id", async (req, res) => {
  const token = req.headers.authorization;
  const { id } = req.params;

  if (!token) {
    return res.status(404).json({
      ok: false,
      data: [],
      error: `Acceso no autorizado.`,
    });
  }
  const { uid } = await verifyToken(token);
  try {
    const empresas = await query(
      `SELECT * FROM empresas WHERE nit=${uid} LIMIT 1`
    );
    if (empresas.length != 0) {
      const response = await query(
        `SELECT * FROM evaluaciones WHERE id=${id} AND empresa_id=${uid}`
      );
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
    console.log(error);
    const message = error.sqlMessage;
    res.status(400).json({
      ok: false,
      data: [],
      error: `Error del servidor, ${message}.`,
    });
  }
});

sgsstRouter.delete("/evaluaciones/:id", async (req, res) => {
  const token = req.headers.authorization;
  const { id } = req.params;

  if (!token) {
    return res.status(404).json({
      ok: false,
      data: [],
      error: `Acceso no autorizado.`,
    });
  }
  await verifyToken(token);
  try {
    const empresas = await query(
      `SELECT * FROM evaluaciones WHERE id=${id} LIMIT 1`
    );
    if (empresas.length != 0) {
      await query(`DELETE FROM evaluaciones WHERE id=${id}`);
      return res.status(200).json({
        ok: true,
        data: {
          message: "Clasificación eliminada con éxito.",
        },
        error: "",
      });
    }
    return res.status(404).json({
      ok: false,
      data: [],
      error: "No existe esta evaluación en el sistema.",
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

// ITEMS DEL ESTANDAR
sgsstRouter.get("/items-evaluacion", async (req, res) => {
  const { num_estandares } = req.query;

  var queryParams = "";

  if (num_estandares === "60") {
    queryParams = "WHERE items_estandar.tipo_3=1";
  }
  if (num_estandares === "21") {
    queryParams = "WHERE items_estandar.tipo_2=1";
  }
  if (num_estandares === "7") {
    queryParams = "WHERE items_estandar.tipo_1=1";
  }
  try {
    const items = await query(
      `SELECT items_estandar.id, items_estandar.numeral, items_estandar.marco_legal, items_estandar.criterio_aceptacion, items_estandar.modo_verificacion, items_estandar.valor, items_estandar.descripcion AS 'item_descripcion', subestandares.descripcion AS 'estandar_minimo_descripcion', subestandares.peso_porcentual, estandares_minimos.nombre AS 'estandar_minimo_nombre', tipo_ciclo.tipo AS ciclo FROM items_estandar INNER JOIN subestandares ON items_estandar.subestandar_id = subestandares.id INNER JOIN estandares_minimos ON subestandares.estandar_minimo_id = estandares_minimos.id INNER JOIN tipo_ciclo ON estandares_minimos.tipo_ciclo_id = tipo_ciclo.id ${queryParams}`
    );

    res.status(200).json({
      ok: true,
      data: items,
      error: "",
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

sgsstRouter.post("/items-evaluacion", async (req, res) => {
  const token = req.headers.authorization;
  const { items } = req.body;
  
  if (!token) {
    return res.status(404).json({
      ok: false,
      data: [],
      error: `Acceso no autorizado.`,
    });
  }
  await verifyToken(token);
  try {
    for (const item in items) {      
      await query(
        `INSERT INTO evaluaciones_items (
          evaluacion_id, 
          item_id, 
          cumple, 
          no_aplica, 
          justifica, 
          observacion, 
          valor) 
          VALUES (${item.evaluacion_id},${item.item_id},${item.cumple},${item.no_aplica}, ${item.justifica},'${item.observacion}', ${item.valor})`
      );
    }

    res.status(200).json({
      ok: true,
      data: {
        id: response.insertId,
        message: "Ítem creado con éxito.",
      },
      error: "",
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


sgsstRouter.delete("/items-evaluacion/:id", async (req, res) => {
  const token = req.headers.authorization;
  const { id } = req.params;

  if (!token) {
    return res.status(404).json({
      ok: false,
      data: [],
      error: `Acceso no autorizado.`,
    });
  }
  await verifyToken(token);
  try {
    const empresas = await query(
      `SELECT * FROM evaluaciones_items WHERE id=${id} LIMIT 1`
    );
    if (empresas.length != 0) {
      await query(`DELETE FROM evaluaciones_items WHERE id=${id}`);
      return res.status(200).json({
        ok: true,
        data: {
          message: "Clasificación eliminada con éxito.",
        },
        error: "",
      });
    }
    return res.status(404).json({
      ok: false,
      data: [],
      error: "No existe esta evaluación en el sistema.",
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

// CICLOS DEL SGSST
sgsstRouter.get("/ciclos", async (req, res) => {
  try {
    const response = await query("SELECT * FROM tipo_ciclo");
    res.status(200).json({
      ok: true,
      data: response,
      error: "",
    });
  } catch (error) {
    const statusCode = error.code;
    const message = error.sqlMessage;
    res.status(statusCode).json({
      ok: false,
      data: [],
      error: `Error del servidor, ${message}.`,
    });
  }
});

// ESTANDARES MINIMOS
sgsstRouter.get("/estandares-minimos", async (req, res) => {
  try {
    const response = await query("SELECT * FROM estandares_minimos");
    res.status(200).json({
      ok: true,
      data: response,
      error: "",
    });
  } catch (error) {
    const statusCode = error.code;
    const message = error.sqlMessage;
    res.status(statusCode).json({
      ok: false,
      data: [],
      error: `Error del servidor, ${message}.`,
    });
  }
});

// SUBSTANDARES
sgsstRouter.get("/subestandares", async (req, res) => {
  try {
    const response = await query("SELECT * FROM subestandares");
    res.status(200).json({
      ok: true,
      data: response,
      error: "",
    });
  } catch (error) {
    const statusCode = error.code;
    const message = error.sqlMessage;
    res.status(statusCode).json({
      ok: false,
      data: [],
      error: `Error del servidor, ${message}.`,
    });
  }
});

// ITEMS DEL ESTANDAR
sgsstRouter.get("/items", async (req, res) => {
  try {
    const response = await query("SELECT * FROM items_estandar");
    res.status(200).json({
      ok: true,
      data: response,
      error: "",
    });
  } catch (error) {
    const message = error.sqlMessage;
    res.status(400).json({
      ok: false,
      data: [],
      error: `Error del servidor, ${message}.`,
    });
  }
});

module.exports = sgsstRouter;
