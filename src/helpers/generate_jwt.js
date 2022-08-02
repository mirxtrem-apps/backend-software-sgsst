const jwt = require("jsonwebtoken");

const generarJWT = (uid = "", admin = false) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, admin };

    jwt.sign(
      payload,
      process.env.AUTH_SECRET,
      {
        expiresIn: process.env.AUTH_EXPIRES,
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

const generarEmailJWT = (correo) => {
  return new Promise((resolve, reject) => {
    const payload = { correo };

    jwt.sign(
      payload,
      process.env.AUTH_SECRET,
      {
        expiresIn: '1h',
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

const verifyToken = (token) => {
  return new Promise( (resolve, reject) => {
    jwt.verify(
      token,
      process.env.AUTH_SECRET,
      (err, decoded) => {
        if(err) {
          if(err.name == 'TokenExpiredError') {
            return reject("Solicitud expiró");
          }
          if(err.name == 'JsonWebTokenError') {
            return reject(err.message);
          }
          return reject("Error al verificar el token");
        } else {
          resolve(decoded);
        }
    })
  });
}

module.exports = {
  generarJWT,
  generarEmailJWT,
  verifyToken
};
