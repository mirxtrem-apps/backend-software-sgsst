const express = require("express");
const query = require("../helpers/promise_conn");

const empresasRouter = express.Router();

empresasRouter.get("/", async (_, res) => {
  try {
    const result = await query(`SELECT * FROM empresas`);
    res.status(200).json({
      ok: true,
      data: result,
      error: "",
    });
  } catch (error) {
    if (error == "No se encontraron registros.") {
      return res.json({
        ok: false,
        data: [],
        error: "No se encontraron empresas registradas.",
      });
    }
    return res.json({
      ok: false,
      data: [],
      error: error,
    });
  }
});

empresasRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  // TODO: CREAR UN TOKEN
  try {
    if (id) {
      const result = await query(
        `SELECT * FROM empresas WHERE credencial_id = ${id} LIMIT 1`
      );
      res.status(200).json({
        ok: true,
        data: result[0],
        error: "",
      });
    } else {
      const result = await query(`SELECT * FROM empresas`);
      res.status(200).json({
        ok: true,
        data: result,
        error: "",
      });
    }
  } catch (error) {
    if (error == "No hay datos") {
      return res.json({
        ok: false,
        data: [],
        error: "No existe la empresa",
      });
    }
    return res.json({
      ok: false,
      data: [],
      error: error,
    });
  }
});

module.exports = empresasRouter;
