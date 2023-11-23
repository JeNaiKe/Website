var models = require("../models/index");
const centrosModel = models.centros;
const sequelize = require("sequelize");

const controllers = {};
controllers.list = async (req, res) => {
  const data = await centrosModel
    .findAll({
      order: [[sequelize.col("Centros.id_centro"), "ASC"]],
    })
    .then(function (data) {
      return data;
    })
    .catch((error) => {
      return error;
    });
  res.json({ success: true, data: data });
};

controllers.listActiveCenters = async (req, res) => {
  const data = await centrosModel
    .findAll({
      where: {
        activeStatus: true,
      },
      order: [[sequelize.col("Centros.id_centro"), "ASC"]],
    })
    .then(function (data) {
      return data;
    })
    .catch((error) => {
      return error;
    });
  res.json({ success: true, data: data });
};

controllers.getCentro = async (req, res) => {
  const { id } = req.params;
  const data = centrosModel
    .findOne({ where: { id_centro: id } })
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.register = async (req, res) => {
  const data = centrosModel
    .create({
      nomecentro: req.body.nomecentro,
      activeStatus: true, //Ativo / Inativo
      id_local: req.body.id_local,
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

controllers.delete = async (req, res) => {
  const { id } = req.params;
  const data = centrosModel
    .destroy({ where: { id_centro: id } })
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.update = async (req, res) => {
  const { id } = req.params;
  const data = centrosModel
    .update(
      {
        nomecentro: req.body.nomecentro,
        id_local: req.body.id_local,
      },
      { where: { id_centro: id } }
    )
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.updateStatus = async (req, res) => {
  const { id } = req.params;
  const data = centrosModel
    .update(
      {
        activeStatus: req.body.activeStatus,
      },
      { where: { id_centro: id } }
    )
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.getNumberOfCenters = async (req, res) => {
  const data = centrosModel
    .count()
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

module.exports = controllers;
