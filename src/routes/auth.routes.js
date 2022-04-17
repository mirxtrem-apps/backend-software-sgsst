const express = require("express");
const bcrypt = require("bcrypt");
var generator = require("generate-password");

const query = require("../helpers/promise_conn");
const sendEmail = require("../helpers/promise_mail");

const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  const { correo, password } = req.body;
  try {
    const response = await query(
      `SELECT * FROM credenciales WHERE correo='${correo}' LIMIT 1`
    );

    if (response.length != 0) {
      const db_password = response[0].password;
      const db_activo = response[0].activo;

      const password_match = bcrypt.compareSync(password, db_password);

      if (password_match) {
        if (db_activo == 1) {

          const userInfo = await query(
            `SELECT credenciales.id, empresas.nit, empresas.razon_social, roles.rol, credenciales.correo, empresas.direccion, empresas.telefono FROM credenciales INNER JOIN roles ON roles.id = credenciales.rol_id INNER JOIN empresas ON credenciales.id = empresas.credencial_id WHERE credenciales.id= ${response[0].id} LIMIT 1`
          );

          res.status(200).json({
            ok: true,
            data: userInfo[0],
            error: "",
          });
        } else {
          res.status(403).json({
            ok: false,
            data: [],
            error: "Este usuario esta inactivo.",
          });
        }
      } else {
        res.status(403).json({
          ok: false,
          data: [],
          error: "Contraseña incorrecta.",
        });
      }
    } else {
      return res.status(403).json({
        ok: false,
        data: [],
        error: "No existe un usuario registrado con este correo.",
      });
    }
  } catch (error) {
    return res.json({
      ok: false,
      data: [],
      error: error,
    });
  }
});
authRouter.post("/registro", async (req, res) => {
  const { correo, password } = req.body;
  try {
    const response = await query(
      `SELECT * FROM credenciales WHERE correo='${correo}' LIMIT 1`
    );
    if (response.length == 0) {
      const rol_id = 3;
      const activo = 1;
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

authRouter.post("/:id/change-password", async (req, res) => {
  const { password, new_password } = req.body;
  const { id } = req.params;
  try {
    const response = await query(
      `SELECT * FROM credenciales WHERE id='${id}' LIMIT 1`
    );
    if (response.length != 0) {
      const db_password = response[0].password;

      const password_match = bcrypt.compareSync(password, db_password);

      if (password_match) {
        const encoded_password = bcrypt.hashSync(new_password, parseInt(12));
        await query(
          `UPDATE credenciales SET password='${encoded_password}' WHERE id=${id}`
        );
        res.status(200).json({
          ok: true,
          data: {
            message: "Se ha cambiado la contraseña con éxito.",
          },
          error: "",
        });
      } else {
        res.status(403).json({
          ok: false,
          data: [],
          error: "Contraseña incorrecta.",
        });
      }
    } else {
      return res.status(403).json({
        ok: false,
        data: [],
        error: "No existe un usuario registrado con este correo.",
      });
    }
  } catch (error) {
    return res.json({
      ok: false,
      data: [],
      error: error,
    });
  }
});

authRouter.post("/reset-password", async (req, res) => {
  const { correo } = req.body;
  console.log(correo);

  try {
    const response = await query(
      `SELECT * FROM credenciales WHERE correo='${correo}' LIMIT 1`
    );
    if (response.length != 0) {
      const temp_password = generator.generate({
        length: 10,
        uppercase: false,
      });

      const encoded_password = bcrypt.hashSync(temp_password, parseInt(12));
      await query(
        `UPDATE credenciales SET password='${encoded_password}' WHERE correo='${correo}'`
      );
      var mailOptions = {
        from: "soporte@segsas.com",
        to: correo,
        subject: "Solicitud de cambio de contraseña.",
        text: `Su contraseña temporal es: ${temp_password}, recuerde cambiar la contraseña desde la sección de seguridad de su perfil de empresa.`,
        // html: '<h1>Welcome</h1><p>That was easy!</p>'
      };
      const info = await sendEmail(mailOptions);
      res.status(200).json({
        ok: true,
        data: {
          info,
          message: `Se ha enviado una contraseña temporal al correo ${correo}.`,
        },
        error: "",
      });
    } else {
      return res.status(403).json({
        ok: false,
        data: [],
        error: "No existe un usuario registrado con este correo.",
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

module.exports = authRouter;
