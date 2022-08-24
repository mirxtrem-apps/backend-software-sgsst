const express = require("express");
const bcrypt = require("bcrypt");

const query = require("../helpers/promise_conn");

const adminRouter = express.Router();

// Amdinistración de usuarios
adminRouter.get("/usuarios", async (req, res) => {
  try {
    const response = await query(`SELECT * FROM credenciales`);
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
adminRouter.get("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await query(
      `SELECT * FROM credenciales WHERE id=${id} LIMIT 1`
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
      error: "No existe este usuario en el sistema",
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});
adminRouter.post("/usuarios", async (req, res) => {
  const { correo, password, rol_id, activo } = req.body;
  try {
    const response = await query(
      `SELECT * FROM credenciales WHERE correo = '${correo}' LIMIT 1`
    );
    if (response.length == 0) {
      // Encriptar la contraseña
      const encoded_password = bcrypt.hashSync(password, parseInt(12));
      const response = await query(
        `INSERT INTO credenciales (correo, password, activo, rol_id) VALUES('${correo}','${encoded_password}',${activo},${rol_id})`
      );
      res.status(200).json({
        ok: true,
        data: {
          id: response.insertId,
          message: "Usuario creado con éxito.",
        },
        error: "",
      });
    } else {
      return res.status(403).json({
        ok: false,
        data: [],
        error: "Ya existe un usuario con este correo.",
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
adminRouter.put("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const { correo, password, rol_id, activo } = req.body;
  try {
    const response = await query(
      `SELECT * FROM credenciales WHERE id = '${id}' LIMIT 1`
    );
    if (response.length != 0) {
      // Encriptar la contraseña
      const encoded_password = bcrypt.hashSync(password, parseInt(12));
      const response = await query(
        `UPDATE credenciales SET correo='${correo}', password='${encoded_password}', activo=${activo}, rol_id=${rol_id} WHERE id=${id}`
      );
      console.log(response);
      res.status(200).json({
        ok: true,
        data: {
          id: response,
          message: "Usuario actualizado con éxito.",
        },
        error: "",
      });
    } else {
      return res.status(404).json({
        ok: false,
        data: [],
        error: "No existe este usuario en el sistema.",
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
adminRouter.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await query(
      `SELECT * FROM credenciales WHERE id = '${id}' LIMIT 1`
    );
    if (response.length != 0) {
      const response = await query(`DELETE FROM credenciales WHERE id=${id}`);
      res.status(200).json({
        ok: true,
        data: {
          message: "Usuario eliminado con éxito.",
        },
        error: "",
      });
    } else {
      return res.status(404).json({
        ok: false,
        data: [],
        error: "No existe este usuario en el sistema.",
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

// Administración de empresas
adminRouter.get("/empresas", async (req, res) => {
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
adminRouter.get("/empresas/:nit", async (req, res) => {
  const { nit } = req.params;
  try {
    const response = await query(
      `SELECT * FROM empresas WHERE nit=${nit} LIMIT 1`
    );
    res.status(200).json({
      ok: true,
      data: response[0],
      error: "",
    });
  } catch (error) {
    res.status(200).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});
adminRouter.post("/empresas", async (req, res) => {
  const {
    credencial_id,
    nit,
    razon_social,
    direccion,
    telefono,
    cod_ciiu,
    mineria,
  } = req.body;
  try {
    const response = await query(
      `SELECT * FROM empresas WHERE nit = '${nit}' LIMIT 1`
    );
    if (response.length == 0) {
      const response = await query(
        `INSERT INTO empresas (credencial_id, nit, razon_social, direccion, telefono, cod_ciiu, mineria) 
            VALUES(${credencial_id}, ${nit}, '${razon_social}', '${direccion}', '${telefono}', ${cod_ciiu}, ${mineria})`
      );
      res.status(200).json({
        ok: true,
        data: {
          id: response.insertId,
          message: "Empresa creada con éxito.",
        },
        error: "",
      });
    } else {
      return res.status(403).json({
        ok: false,
        data: [],
        error: "Ya existe una empresa registrada en el sistema con este nit.",
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
adminRouter.put("/empresas/:nit", async (req, res) => {
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
adminRouter.delete("/empresas/:id", async (req, res) => {
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

// CICLOS DEL SGSST
adminRouter.get("/sgsst/ciclos", async (req, res) => {
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
adminRouter.get("/sgsst/ciclos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await query(
      `SELECT * FROM tipo_ciclo WHERE id=${id} LIMIT 1`
    );
    res.status(200).json({
      ok: true,
      data: response[0],
      error: "",
    });
  } catch (error) {
    res.status(200).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});
adminRouter.post("/sgsst/ciclos", async (req, res) => {
  const { tipo } = req.body;
  try {
    const response = await query(
      `INSERT INTO tipo_ciclo (tipo) 
          VALUES("${tipo}")`
    );
    res.status(200).json({
      ok: true,
      data: {
        id: response.insertId,
        message: "Ciclo creado éxitosamente.",
      },
      error: "",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});
adminRouter.put("/sgsst/ciclos/:id", async (req, res) => {
  const { id } = req.params;
  const { tipo } = req.body;
  try {
    const response = await query(
      `SELECT * FROM tipo_ciclo WHERE id=${id} LIMIT 1`
    );
    if (response.length != 0) {
      const response = await query(
        `UPDATE tipo_ciclo 
            SET tipo= '${tipo}'
            WHERE id= ${id}`
      );

      res.status(200).json({
        ok: true,
        data: {
          message: "Ciclo actualizado exitosamente.",
        },
        error: "",
      });
    } else {
      return res.status(404).json({
        ok: false,
        data: [],
        error: "No existe este ciclo en el sistema.",
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
adminRouter.delete("/sgsst/ciclos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await query(
      `SELECT * FROM tipo_ciclo WHERE id='${id}' LIMIT 1`
    );
    if (response.length != 0) {
      const response = await query(`DELETE FROM tipo_ciclo WHERE id=${id}`);
      res.status(200).json({
        ok: true,
        data: {
          message: "Ciclo eliminado éxitosamente.",
        },
        error: "",
      });
    } else {
      return res.status(404).json({
        ok: false,
        data: [],
        error: "No existe este ciclo en el sistema.",
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
adminRouter.delete("/sgsst/ciclos", async (req, res) => {
  try {
    await query(`DELETE FROM tipo_ciclo`);
    res.status(200).json({
      ok: true,
      data: {
        message: "Ciclos eliminados éxitosamente.",
      },
      error: "",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});

// ESTANDARES MINIMOS
adminRouter.get("/sgsst/estandares-minimos", async (req, res) => {
  console.log(req.query);
  const { cicloId } = req.query;
  try {
    var response;
    if (cicloId) {
      response = await query(
        `SELECT * FROM estandares_minimos WHERE tipo_ciclo_id=${cicloId}`
      );
    } else {
      response = await query("SELECT * FROM estandares_minimos");
    }

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
adminRouter.get("/sgsst/estandares-minimos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await query(
      `SELECT * FROM estandares_minimos WHERE id=${id} LIMIT 1`
    );
    console.log(response);
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
      error: "No existe este estandar mínimo en el sistema",
    });
  } catch (error) {
    res.status(200).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});
adminRouter.post("/sgsst/estandares-minimos", async (req, res) => {
  const { tipo_ciclo_id, nombre } = req.body;
  try {
    const response = await query(
      `INSERT INTO estandares_minimos (tipo_ciclo_id, nombre) 
          VALUES(${tipo_ciclo_id}, "${nombre}")`
    );
    res.status(200).json({
      ok: true,
      data: {
        id: response.insertId,
        message: "Estandar mínimo creado éxitosamente.",
      },
      error: "",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});
adminRouter.put("/sgsst/estandares-minimos/:id", async (req, res) => {
  const { id } = req.params;
  const { tipo_ciclo_id, nombre } = req.body;
  try {
    const response = await query(
      `SELECT * FROM estandares_minimos WHERE id=${id} LIMIT 1`
    );
    if (response.length != 0) {
      await query(
        `UPDATE estandares_minimos 
            SET tipo_ciclo_id='${tipo_ciclo_id}', 
            nombre='${nombre}'
            WHERE id=${id}`
      );

      return res.status(200).json({
        ok: true,
        data: {
          message: "Estandar mínimo actualizado éxitosamente.",
        },
        error: "",
      });
    }
    return res.status(404).json({
      ok: false,
      data: [],
      error: "No existe este ítem en el sistema.",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});
adminRouter.delete("/sgsst/estandares-minimos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await query(
      `SELECT * FROM estandares_minimos WHERE id='${id}' LIMIT 1`
    );
    if (response.length != 0) {
      const response = await query(
        `DELETE FROM estandares_minimos WHERE id=${id}`
      );
      res.status(200).json({
        ok: true,
        data: {
          message: "Estandar mínimo eliminado éxitosamente.",
        },
        error: "",
      });
    } else {
      return res.status(404).json({
        ok: false,
        data: [],
        error: "No existe este estandar mínimo en el sistema.",
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
adminRouter.delete("/sgsst/estandares-minimos", async (req, res) => {
  try {
    await query(`DELETE FROM estandares_minimos`);
    res.status(200).json({
      ok: true,
      data: {
        message: "Estandares mínimos eliminados éxitosamente.",
      },
      error: "",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});

// SUBSTANDARES
adminRouter.get("/sgsst/subestandares", async (req, res) => {
  console.log(req.query);
  const { estandarId } = req.query;
  try {
    var response;
    if (estandarId) {
      response = await query(
        `SELECT * FROM subestandares WHERE estandar_minimo_id=${estandarId}`
      );
    } else {
      response = await query(`SELECT * FROM subestandares`);
    }
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
adminRouter.get("/sgsst/subestandares/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await query(
      `SELECT * FROM subestandares WHERE id=${id} LIMIT 1`
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
      error: "No existe este subestandar en el sistema.",
    });
  } catch (error) {
    res.status(200).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});
adminRouter.post("/sgsst/subestandares", async (req, res) => {
  const { estandar_minimo_id, descripcion, peso_porcentual } = req.body;
  try {
    const response = await query(
      `INSERT INTO subestandares (estandar_minimo_id, descripcion, peso_porcentual) 
          VALUES(${estandar_minimo_id}, '${descripcion}', ${peso_porcentual})`
    );
    res.status(200).json({
      ok: true,
      data: {
        id: response.insertId,
        message: "Subestandar creado éxitosamente.",
      },
      error: "",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});
adminRouter.put("/sgsst/subestandares/:id", async (req, res) => {
  const { id } = req.params;
  const { estandar_minimo_id, descripcion, peso_porcentual } = req.body;
  try {
    const response = await query(
      `SELECT * FROM subestandares WHERE id=${id} LIMIT 1`
    );
    if (response.length != 0) {
      await query(
        `UPDATE subestandares 
            SET estandar_minimo_id='${estandar_minimo_id}', 
            descripcion='${descripcion}', 
            peso_porcentual='${peso_porcentual}'
            WHERE id=${id}`
      );

      res.status(200).json({
        ok: true,
        data: {
          message: "Subestandar actualizado exitosamente.",
        },
        error: "",
      });
    } else {
      return res.status(404).json({
        ok: false,
        data: [],
        error: "No existe este subestandar en el sistema.",
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
adminRouter.delete("/sgsst/subestandares/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await query(
      `SELECT * FROM subestandares WHERE id='${id}' LIMIT 1`
    );
    if (response.length != 0) {
      const response = await query(`DELETE FROM subestandares WHERE id=${id}`);
      res.status(200).json({
        ok: true,
        data: {
          message: "Subestandar eliminado éxitosamente.",
        },
        error: "",
      });
    } else {
      return res.status(404).json({
        ok: false,
        data: [],
        error: "No existe este subestandar en el sistema.",
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
adminRouter.delete("/sgsst/subestandares", async (req, res) => {
  try {
    await query(`DELETE FROM subestandares`);
    res.status(200).json({
      ok: true,
      data: {
        message: "Subestandares eliminados éxitosamente.",
      },
      error: "",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});

// ITEMS DEL ESTANDAR
adminRouter.get("/sgsst/items", async (req, res) => {
  try {
    const items = await query(
      `SELECT items_estandar.id, items_estandar.numeral, items_estandar.marco_legal, items_estandar.criterio_aceptacion, items_estandar.modo_verificacion, items_estandar.valor, items_estandar.descripcion AS 'item_descripcion', subestandares.descripcion AS 'estandar_minimo_descripcion', subestandares.peso_porcentual, estandares_minimos.nombre AS 'estandar_minimo_nombre', tipo_ciclo.tipo AS ciclo FROM items_estandar INNER JOIN subestandares ON items_estandar.subestandar_id = subestandares.id INNER JOIN estandares_minimos ON subestandares.estandar_minimo_id = estandares_minimos.id INNER JOIN tipo_ciclo ON estandares_minimos.tipo_ciclo_id = tipo_ciclo.id`
    );

    const response = {};

    res.status(200).json({
      ok: true,
      data: items,
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
adminRouter.get("/sgsst/items/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await query(
      `SELECT * FROM items_estandar WHERE id=${id} LIMIT 1`
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
      error: "No existe este ítem en el sistema.",
    });
  } catch (error) {
    res.status(200).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});
adminRouter.post("/sgsst/items", async (req, res) => {
  const {
    subestandar_id,
    numeral,
    marco_legal,
    criterio_aceptacion,
    modo_verificacion,
    valor,
    descripcion,
    tipo_1,
    tipo_2,
    tipo_3,
  } = req.body;
  try {
    const response = await query(
      `INSERT INTO items_estandar (subestandar_id, numeral, marco_legal, criterio_aceptacion, modo_verificacion, valor, descripcion, tipo_1, tipo_2, tipo_3) 
          VALUES(${subestandar_id}, '${numeral}', '${marco_legal}', '${criterio_aceptacion}', '${modo_verificacion}', ${valor}, '${descripcion}', ${tipo_1}, ${tipo_2}, ${tipo_3})`
    );
    res.status(200).json({
      ok: true,
      data: {
        id: response.insertId,
        message: "Ítem creado éxitosamente.",
      },
      error: "",
    });
  } catch (error) {
    const message = error.sqlMessage;
    console.log(error);
    res.status(400).json({
      ok: false,
      data: [],
      error: `Error del servidor, ${message}.`,
    });
  }
});
adminRouter.put("/sgsst/items/:id", async (req, res) => {
  const { id } = req.params;
  const {
    subestandar_id,
    numeral,
    marco_legal,
    criterio_aceptacion,
    modo_verificacion,
    valor,
    descripcion,
    tipo_1,
    tipo_2,
    tipo_3,
  } = req.body;
  try {
    const response = await query(
      `SELECT * FROM items_estandar WHERE id=${id} LIMIT 1`
    );
    if (response.length != 0) {
      await query(
        `UPDATE items_estandar 
            SET tipo_evaluacion_id='${tipo_evaluacion_id}', 
            subestandar_id='${subestandar_id}', 
            numeral='${numeral}', 
            marco_legal='${marco_legal}', 
            criterio_aceptacion='${criterio_aceptacion}',
            modo_verificacion='${modo_verificacion}',
            valor=${valor},
            descripcion='${descripcion}', 
            tipo_1=${tipo_1}, 
            tipo_2=${tipo_2}, 
            tipo_3=${tipo_3} 
            WHERE id=${id}`
      );

      res.status(200).json({
        ok: true,
        data: {
          message: "Ítem actualizado exitosamente.",
        },
        error: "",
      });
    } else {
      return res.status(404).json({
        ok: false,
        data: [],
        error: "No existe este ítem en el sistema.",
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
adminRouter.delete("/sgsst/items/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await query(
      `SELECT * FROM items_estandar WHERE id='${id}' LIMIT 1`
    );
    if (response.length != 0) {
      const response = await query(`DELETE FROM items_estandar WHERE id=${id}`);
      res.status(200).json({
        ok: true,
        data: {
          message: "Ítem eliminado éxitosamente.",
        },
        error: "",
      });
    } else {
      return res.status(404).json({
        ok: false,
        data: [],
        error: "No existe este ítem en el sistema.",
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
adminRouter.delete("/sgsst/items", async (req, res) => {
  try {
    await query(`DELETE FROM items_estandar`);
    res.status(200).json({
      ok: true,
      data: {
        message: "Ítems eliminados éxitosamente.",
      },
      error: "",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});

// TIPOS DE EVALUACIÓN
adminRouter.get("/sgsst/tipos-evaluacion", async (req, res) => {
  try {
    const response = await query("SELECT * FROM tipos_evaluacion");
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
adminRouter.get("/sgsst/tipos-evaluacion/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await query(
      `SELECT * FROM tipos_evaluacion WHERE id=${id} LIMIT 1`
    );
    if (response.length != 0) {
      return res.status(200).json({
        ok: true,
        data: response[0],
        error: "",
      });
    }
    return res.status(200).json({
      ok: false,
      data: [],
      error: "No existe este tipo de evaluación en el sistema.",
    });
  } catch (error) {
    res.status(200).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});
adminRouter.post("/sgsst/tipos-evaluacion", async (req, res) => {
  const { tipo, responsable, descripcion, cita } = req.body;
  try {
    const response = await query(
      `INSERT INTO tipos_evaluacion (tipo, responsable, descripcion, cita) 
          VALUES("${tipo}", "${responsable}","${descripcion}","${cita}")`
    );
    res.status(200).json({
      ok: true,
      data: {
        id: response.insertId,
        message: "Tipo de evaluación creado éxitosamente.",
      },
      error: "",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});
adminRouter.put("/sgsst/tipos-evaluacion/:id", async (req, res) => {
  const { id } = req.params;
  const { tipo, responsable, descripcion, cita } = req.body;
  try {
    const response = await query(
      `SELECT * FROM tipos_evaluacion WHERE id=${id} LIMIT 1`
    );
    if (response.length != 0) {
      await query(
        `UPDATE tipos_evaluacion 
            SET tipo= '${tipo}',
            responsable="${responsable}",
            descripcion="${descripcion}",
            cita="${cita}" 
            WHERE id= ${id}`
      );

      res.status(200).json({
        ok: true,
        data: {
          message: "Tipo de evaluación actualizado exitosamente.",
        },
        error: "",
      });
    } else {
      return res.status(404).json({
        ok: false,
        data: [],
        error: "No existe este tipo de evaluación en el sistema.",
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
adminRouter.delete("/sgsst/tipos-evaluacion/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await query(
      `SELECT * FROM tipos_evaluacion WHERE id='${id}' LIMIT 1`
    );
    if (response.length != 0) {
      const response = await query(
        `DELETE FROM tipos_evaluacion WHERE id=${id}`
      );
      res.status(200).json({
        ok: true,
        data: {
          message: "Tipo de evaluación eliminado éxitosamente.",
        },
        error: "",
      });
    } else {
      return res.status(404).json({
        ok: false,
        data: [],
        error: "No existe este tipo de evaluación en el sistema.",
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
adminRouter.delete("/sgsst/tipos-evaluacion", async (req, res) => {
  try {
    await query(`DELETE FROM tipos_evaluacion`);
    res.status(200).json({
      ok: true,
      data: {
        message: "Tipos de evaluación eliminados éxitosamente.",
      },
      error: "",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});

// TIPOS DE RESPONSABLE
adminRouter.get("/sgsst/tipos-responsable", async (req, res) => {
  try {
    const response = await query("SELECT * FROM tipos_responsable");
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
adminRouter.get("/sgsst/tipos-responsable/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await query(
      `SELECT * FROM tipos_responsable WHERE id=${id} LIMIT 1`
    );
    if (response.length != 0) {
      return res.status(200).json({
        ok: true,
        data: response[0],
        error: "",
      });
    }
    return res.status(200).json({
      ok: false,
      data: [],
      error: "No existe este tipo responsable en el sistema.",
    });
  } catch (error) {
    res.status(200).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});
adminRouter.post("/sgsst/tipos-responsable", async (req, res) => {
  const { tipo } = req.body;
  try {
    const response = await query(
      `INSERT INTO tipos_responsable (tipo) 
          VALUES("${tipo}")`
    );
    res.status(200).json({
      ok: true,
      data: {
        id: response.insertId,
        message: "Tipo de responsable creado éxitosamente.",
      },
      error: "",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});
adminRouter.put("/sgsst/tipos-responsable/:id", async (req, res) => {
  const { id } = req.params;
  const { tipo } = req.body;
  try {
    const response = await query(
      `SELECT * FROM tipos_responsable WHERE id=${id} LIMIT 1`
    );
    if (response.length != 0) {
      const response = await query(
        `UPDATE tipos_responsable 
            SET tipo= '${tipo}'
            WHERE id= ${id}`
      );

      res.status(200).json({
        ok: true,
        data: {
          message: "Tipo de responsable actualizado exitosamente.",
        },
        error: "",
      });
    } else {
      return res.status(404).json({
        ok: false,
        data: [],
        error: "No existe este tipo de responsable en el sistema.",
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
adminRouter.delete("/sgsst/tipos-responsable/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await query(
      `SELECT * FROM tipos_responsable WHERE id='${id}' LIMIT 1`
    );
    if (response.length != 0) {
      const response = await query(
        `DELETE FROM tipos_responsable WHERE id=${id}`
      );
      res.status(200).json({
        ok: true,
        data: {
          message: "Tipo de responsable eliminado éxitosamente.",
        },
        error: "",
      });
    } else {
      return res.status(404).json({
        ok: false,
        data: [],
        error: "No existe este tipo de responsable en el sistema.",
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
adminRouter.delete("/sgsst/tipos-responsable", async (req, res) => {
  try {
    await query(`DELETE FROM tipos_responsable`);
    res.status(200).json({
      ok: true,
      data: {
        message: "Tipos de responsable eliminados éxitosamente.",
      },
      error: "",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});

// TIPOS DE VALORACION
adminRouter.get("/sgsst/tipos-valoracion", async (req, res) => {
  try {
    const response = await query("SELECT * FROM tipos_valoracion");
    res.status(200).json({
      ok: true,
      data: response,
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
adminRouter.get("/sgsst/tipos-valoracion/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await query(
      `SELECT * FROM tipos_valoracion WHERE id=${id} LIMIT 1`
    );
    if (response.length != 0) {
      return res.status(200).json({
        ok: true,
        data: response[0],
        error: "",
      });
    }
    return res.status(200).json({
      ok: false,
      data: [],
      error: "No existe este tipo de valoración en el sistema.",
    });
  } catch (error) {
    res.status(200).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});
adminRouter.post("/sgsst/tipos-valoracion", async (req, res) => {
  const { tipo, min, max } = req.body;
  try {
    const response = await query(
      `INSERT INTO tipos_valoracion (tipo, min, max) 
          VALUES("${tipo}", ${min}, ${max})`
    );
    res.status(200).json({
      ok: true,
      data: {
        id: response.insertId,
        message: "Tipo de valoración creado éxitosamente.",
      },
      error: "",
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
adminRouter.put("/sgsst/tipos-valoracion/:id", async (req, res) => {
  const { id } = req.params;
  const { tipo, min, max } = req.body;
  try {
    const response = await query(
      `SELECT * FROM tipos_valoracion WHERE id=${id} LIMIT 1`
    );
    if (response.length != 0) {
      await query(
        `UPDATE tipos_valoracion 
            SET tipo= '${tipo}',
            min= ${min},
            max= ${max}
            WHERE id= ${id}`
      );

      res.status(200).json({
        ok: true,
        data: {
          message: "Tipo de valoración actualizado exitosamente.",
        },
        error: "",
      });
    } else {
      return res.status(404).json({
        ok: false,
        data: [],
        error: "No existe este tipo de valoración en el sistema.",
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
adminRouter.delete("/sgsst/tipos-valoracion/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await query(
      `SELECT * FROM tipos_valoracion WHERE id='${id}' LIMIT 1`
    );
    if (response.length != 0) {
      await query(`DELETE FROM tipos_valoracion WHERE id=${id}`);
      res.status(200).json({
        ok: true,
        data: {
          message: "Tipo de valoración eliminado éxitosamente.",
        },
        error: "",
      });
    } else {
      return res.status(404).json({
        ok: false,
        data: [],
        error: "No existe este tipo de valoración en el sistema.",
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
adminRouter.delete("/sgsst/tipos-valoracion", async (req, res) => {
  try {
    await query(`DELETE FROM tipos_valoracion`);
    res.status(200).json({
      ok: true,
      data: {
        message: "Tipos de veloración eliminados éxitosamente.",
      },
      error: "",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});

module.exports = adminRouter;
