const authController = require("../src/controllers/auth_controller");
const sendEmail = require("../src/helpers/promise_mail");

xdescribe("Autenticación", () => {
  // const jwt = require("../src/helpers/generate_jwt");
  const query = require("../src/helpers/promise_conn");
  // const bcrypt = require("bcrypt");
  let jwt;
  // let query;
  let bcrypt;
  
  beforeEach(()=> {
    jwt = {
      generarJWT: (id, isAdmin) => {
        return jest.fn().mockResolvedValue("");
      }
    }
    // query = (q) => {
    //   return jest.fn().mockResolvedValue({result: []});
    // }
    bcrypt = {
      compareSync: (p1, p2) => {
        return jest.fn().mockResolvedValue(true);
      }
    }
  });

  describe('Registro', () => {
    it('Registro de usuario nuevo', async() => {        
        const req = {
            body: {
              correo: "mirxtrem.apps@gmail.com",
              password: "654321",
            },
          };
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
          };
          await authController({ query, bcrypt, jwt, sendEmail }).registro(req, res);
          //   Debe retornar un status code 200
          expect(res.status.mock.calls).toEqual([[403]]);
    });
    it('Registro de usuario duplicado', async () => {
        const req = {
            body: {
              correo: "usuario@test.com",
              password: "654321",
            },
          };
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
          };
          await authController({ query, bcrypt, jwt }).registro(req, res);
          //   Debe retornar un status code 403
          expect(res.status.mock.calls).toEqual([[403]]);
    });
  });

  describe("Login", () => {
    it("Login de usuario exitoso", async () => {
      const req = {
        body: {
          correo: "gusaarango9@misena.edu.co",
          password: "654321",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await authController({ query, bcrypt, jwt }).login(req, res);
      //   Debe retornar un status code 200
      expect(res.status.mock.calls).toEqual([[200]]);
    });

    it("Login fallido - usuario no existe", async () => {
      const req = {
        body: {
          correo: "abc@misena.edu.co",
          password: "123456",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      console.log(res.json.mock.calls);

      await authController({ query, bcrypt, jwt }).login(req, res);
      // Debe retorna un código de respuesta 404 - Not found
      expect(res.status.mock.calls).toEqual([[404]]);
    });

    it("Login fallido - Usuario no activo", async () => {
      const req = {
        body: {
          correo: "usuario@test.com",
          password: "654321",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await authController({ query, bcrypt, jwt }).login(req, res);
      // Debe retorna un código de respuesta 403 - Forbidden
      expect(res.status.mock.calls).toEqual([[403]]);
    });

    it("Login fallido - contraseña incorrecta", async () => {
      const req = {
        body: {
          correo: "gusaarango9@misena.edu.co",
          password: "123456", // Contraseña incorrecta
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await authController({ query, bcrypt, jwt }).login(req, res);
      // Debe retorna un código de respuesta 403 - Forbidden
      expect(res.status.mock.calls).toEqual([[403]]);
    });
  });
});
