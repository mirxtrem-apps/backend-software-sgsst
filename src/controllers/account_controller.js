const accountController = ({ query }) => ({
  create: async (req, res) => {
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
      const empresas = await query(
        `SELECT * FROM empresas WHERE nit = '${nit}' LIMIT 1`
      );
      if (empresas.length === 0) {
        const response = await query(
          `INSERT INTO empresas (credencial_id, nit, razon_social, direccion, telefono, cod_ciiu, mineria) 
                    VALUES(${credencial_id}, ${nit}, '${razon_social}', '${direccion}', '${telefono}', ${cod_ciiu}, ${mineria})`
        );
        console.log(req.body);

        return res.status(200).json({
          data: {
            id: response.insertId,
            message: "Empresa creada con éxito.",
          },
          message: "",
        });
      } else {
        return res.status(403).json({
          data: null,
          message:
            "Ya existe una empresa registrada en el sistema con este nit.",
        });
      }
    } catch (error) {
      return res.status(400).json({
        data: null,
        message: error,
      });
    }
  },
});

module.exports = accountController;
