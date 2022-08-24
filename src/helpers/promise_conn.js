const pool = require("../database/conn");

const query = (query) => {
  return new Promise((resolve, reject) => {
    pool.query(query, function (error, results, fields) {
      if (error) {
        console.log("MySQL Error: ", error);
        return reject(error);
      }
      return resolve(results);
    });
  });
};

module.exports = query;
