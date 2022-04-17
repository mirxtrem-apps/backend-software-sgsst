const connection = require("../database/conn");

const query = (query) => {
  return new Promise((resolve, reject) => {
    connection.query(query, function (error, results, fields) {
      if (error) return reject(error);
      return resolve(results);
    });
  });
};

module.exports = query;
