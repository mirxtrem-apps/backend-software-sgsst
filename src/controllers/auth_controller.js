const authController = ({ query, bcrypt, jwt, sendEmail }) => ({
  login: async (req, res) => {
    const { correo, password } = req.body;
    try {
      const response = await query(
        `SELECT * FROM credenciales WHERE correo='${correo}' LIMIT 1`
      );

      if (response.length != 0) {
        const credencial = response[0];
        const password_match = bcrypt.compareSync(
          password,
          credencial.password
        );

        if (password_match) {
          if (credencial.activo == 1) {
            const empresas = await query(
              `SELECT * FROM empresas WHERE credencial_id=${credencial.id}`
            );

            if (empresas.length !== 0) {
              const userInfo = await query(
                `SELECT credenciales.id, roles.rol, credenciales.correo FROM credenciales INNER JOIN roles ON roles.id = credenciales.rol_id WHERE credenciales.id= ${credencial.id} LIMIT 1`
              );

              const admin = userInfo[0].rol == "admin";
              const token = await jwt.generarJWT(empresas[0].nit, admin);

              return res.status(200).json({
                data: {
                  usuario: empresas[0],
                  token,
                  admin,
                },
                message: "",
              });
            } else {
              return res.status(401).json({
                data: {
                  id: credencial.id,
                },
                message: "Formulario pendiente.",
              });
            }
          } else {
            return res.status(403).json({
              data: null,
              message: "Este usuario esta inactivo.",
            });
          }
        } else {
          return res.status(403).json({
            data: null,
            message: "Contraseña incorrecta.",
          });
        }
      } else {
        return res.status(404).json({
          data: null,
          message: "No existe un usuario registrado con este correo.",
        });
      }
    } catch (error) {
      return res.status(400).json({
        data: null,
        message: error,
      });
    }
  },
  registro:  async (req, res) => {
    const { correo, password } = req.body;
    try {
      const response = await query(
        `SELECT * FROM credenciales WHERE correo='${correo}' LIMIT 1`
      );
  
      if (response.length == 0) {
        const rol_id = 3;
        const activo = 0;
        const encoded_password = bcrypt.hashSync(password, parseInt(12));
  
        const response = await query(
          `INSERT INTO credenciales (correo, password, activo, rol_id) VALUES('${correo}','${encoded_password}',${activo},${rol_id})`
        );
  
        const token = await jwt.generarEmailJWT(correo);
  
        var mailOptions = {
          from: "soporte@segsas.com",
          to: correo,
          subject: "Verificar tu correo | software SGSST",
          html: `
            <h1>Bienvenido!</h1>
            <p>Gracias por usar el software SG-SST, para terminar su registro por favor ingrese en el siguiente link:</p>
            <a href='https://software-sgsst.web.app/confirm-email?auth=${token}'>Verificar mi correo</a>`,
        };
        // https://software-sgsst.web.app
  
        await sendEmail(mailOptions);
  
        return res.status(200).json({
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
  }
});

module.exports = authController;
