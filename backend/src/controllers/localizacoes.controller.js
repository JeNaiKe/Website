var models = require("../models/index");
const localizacoesModel = models.localizacoes;
const sequelize = require("sequelize");

const controllers = {};
controllers.list = async (req, res) => {
  const data = await localizacoesModel
    .findAll({
      order: [[sequelize.col("id_local"), "ASC"]],
    })
    .then(function (data) {
      return data;
    })
    .catch((error) => {
      return error;
    });
  res.json({ success: true, data: data });
};

controllers.register = async (req, res) => {
  const data = localizacoesModel
    .create({
      freguesia: req.body.freguesia,
      distrito: req.body.distrito,
      codigopostal: req.body.codigopostal,
    })
    .then(function (data) {
      return data;
    })
    .catch((error) => {
      console.log("Erro: " + error);
      return error;
    });
  res.status(200).json({
    success: true,
    message: "Registado",
    data: data,
  });
};

controllers.getLocalizacoes = async (req, res) => {
  const { id } = req.params;
  const data = localizacoesModel
    .findOne({ where: { id_local: id } })
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.delete = async (req, res) => {
  const { id } = req.params;
  const data = localizacoesModel
    .destroy({ where: { id_local: id } })
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.updateLocal = async (req, res) => {
  const { id } = req.params;
  const data = localizacoesModel
    .update(
      {
        freguesia: req.body.freguesia,
        distrito: req.body.distrito,
        codigopostal: req.body.codigopostal,
      },
      { where: { id_local: id } }
    )
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

module.exports = controllers;
