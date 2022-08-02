const express = require("express");
const bcrypt = require("bcrypt");
var generator = require("generate-password");

const query = require("../helpers/promise_conn");
const sendEmail = require("../helpers/promise_mail");
const jwt = require("../helpers/generate_jwt");
const { JsonWebTokenError } = require("jsonwebtoken");

const auth = require('../controllers/auth_controller');

const authController = auth({query, bcrypt, jwt, sendEmail});

const authRouter = express.Router();

authRouter.post("/login", authController.login );

authRouter.post("/registro", authController.registro);

authRouter.get("/confirm-email", async (req, res) => {
  const { token } = req.headers;

  try {
    const { correo } = await verifyToken(token);
    console.log(correo);

    const response = await query(
      `SELECT * FROM credenciales WHERE correo='${correo}' LIMIT 1`
    );

    if (response.length != 0) {
      await query(`UPDATE credenciales SET activo=1 WHERE correo='${correo}'`);

      res.status(200).json({
        ok: true,
        data: {
          message: "Correo verificado.",
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
    return res.status(401).json({
      ok: false,
      data: [],
      error: error,
    });
  }
});

authRouter.post("/resend-email", async (req, res) => {
  const { correo } = req.body;

  try {
    const response = await query(
      `SELECT * FROM credenciales WHERE correo='${correo}' LIMIT 1`
    );

    if (response.length != 0) {
      const token = await generarEmailJWT(correo);

      var mailOptions = {
        from: "soporte@segsas.com",
        to: correo,
        subject: "Verificar tu correo | software SGSST",
        html: `
          <h1>Solicitud de verificación</h1>
          <p>Para terminar su registro por favor ingrese en el siguiente link:</p>
          <a href='http://localhost:4200/confirm-email?auth=${token}'>Verificar mi correo</a>`,
      };

      await sendEmail(mailOptions);

      res.status(200).json({
        ok: true,
        data: {
          message: "Correo de verificación enviado.",
        },
        error: "",
      });
    } else {
      return res.status(404).json({
        ok: false,
        data: [],
        error: "No existe un usuario registrado con este correo.",
      });
    }
  } catch (error) {
    return res.status(401).json({
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
