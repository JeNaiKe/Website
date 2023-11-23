var models = require("../models/index");
const tipoUser = models.tipoutilizador;
const sequelize = require("sequelize");

const controllers = {};
controllers.list = async (req, res) => {
  const data = await tipoUser
    .findAll({
      order: [[sequelize.col("id_tipoUtilizador"), "ASC"]],
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
