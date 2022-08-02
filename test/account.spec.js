const accountController = require("../src/controllers/account_controller");

describe("Account - Cuenta", () => {
  
  describe('Crear empresas', () => {
    const query = require("../src/helpers/promise_conn");
    it('Crear empresa nueva', async() => {        
        const req = {
            body: {
              credencial_id: 12,
              nit: 94061277,
              razon_social: "Empresa 1",
              direccion: "Calle 123",
              telefono: "3216549870",
              cod_ciiu: 123456,
              mineria: 0,
            },
          };
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
          await accountController({ query }).create(req, res);
          //   Debe retornar un status code 200
          expect(res.status.mock.calls).toEqual([[200]]);
    });
    it('Crear empresa nit duplicada', async () => {
        const req = {
            body: {
              credencial_id: 22,
              nit: 94061277,
              razon_social: "Empresa 2",
              direccion: "Calle 123",
              telefono: "3216549870",
              cod_ciiu: 123456,
              mineria: 0,
            },
          };
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
          await accountController({ query }).create(req, res);
          //   Debe retornar un status code 403
          expect(res.status.mock.calls).toEqual([[403]]);
    });
  });

});
