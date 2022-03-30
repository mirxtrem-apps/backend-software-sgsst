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
        const response = await query(
          `DELETE FROM credenciales WHERE id=${id}`
        );
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

// Amdinistración de empresas
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
  adminRouter.get("/empresas/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const response = await query(
        `SELECT * FROM empresas WHERE id=${id} LIMIT 1`
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
  
    const { credencial_id, nit, razon_social, direccion, telefono, cod_ciiu, mineria } = req.body;
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
      const { id } = req.params;
      try {
        const response = await query(
          `SELECT * FROM empresas WHERE nit='${id}' LIMIT 1`
        );
        if (response.length != 0) {
          const response = await query(
            `DELETE FROM empresas WHERE nit=${id}`
          );
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

// Amdinistración del SGSST
adminRouter.get("/sgsst/items", () => {});
adminRouter.get("/sgsst/items/:id", () => {});
adminRouter.post("/sgsst/items", () => {});
adminRouter.put("/sgsst/items/:id", () => {});
adminRouter.delete("/sgsst/items/:id", () => {});
adminRouter.delete("/sgsst/items", () => {});

adminRouter.get("/sgsst/subestandares", () => {});
adminRouter.get("/sgsst/subestandares/:id", () => {});
adminRouter.post("/sgsst/subestandares", () => {});
adminRouter.put("/sgsst/subestandares/:id", () => {});
adminRouter.delete("/sgsst/subestandares/:id", () => {});

adminRouter.get("/sgsst/estandares-minimos", () => {});
adminRouter.get("/sgsst/estandares-minimos/:id", () => {});
adminRouter.post("/sgsst/estandares-minimos", () => {});
adminRouter.put("/sgsst/estandares-minimos/:id", () => {});
adminRouter.delete("/sgsst/estandares-minimos/:id", () => {});

adminRouter.get("/sgsst/ciclos", () => {});
adminRouter.get("/sgsst/ciclos/:id", () => {});
adminRouter.post("/sgsst/ciclos", () => {});
adminRouter.put("/sgsst/ciclos/:id", () => {});
adminRouter.delete("/sgsst/ciclos/:id", () => {});

module.exports = adminRouter;
