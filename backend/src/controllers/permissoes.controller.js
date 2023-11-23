var models = require("../models/index");
const permissoesModel = models.permissoesUtilizador;
const sequelize = require("sequelize");

const controllers = {};
controllers.list = async (req, res) => {
  const data = await permissoesModel
    .findAll({
      order: [[sequelize.col("id_permissao"), "ASC"]],
    })
    .then(function (data) {
      return data;
    })
    .catch((error) => {
      return error;
    });
  res.json({ success: true, data: data });
};

module.exports = controllers;
