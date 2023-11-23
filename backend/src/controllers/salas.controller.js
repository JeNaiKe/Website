var models = require("../models/index");
const salasModel = models.salas;
const reservasModel = models.reservas;
const sequelize = require("sequelize");
const db = require("../models");
const { QueryTypes } = require("sequelize");

const controllers = {};
controllers.list = async (req, res) => {
  const data = await salasModel
    .findAll({
      order: [[sequelize.col("id_sala"), "ASC"]],
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
  const data = salasModel
    .create({
      nomesala: req.body.nomesala,
      descricao: req.body.descricao,
      alocacao_maxima: req.body.alocacao_maxima,
      alocacao_percent: req.body.alocacao_percent,
      tempo_limpeza: req.body.tempo_limpeza,
      activeStatus: true,
      id_centro: req.body.id_centro,
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
  const data = salasModel
    .destroy({ where: { id_sala: id } })
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.listActiveSalas = async (req, res) => {
  const data = await salasModel
    .findAll({ where: { activeStatus: true }, order: [[sequelize.col("id_sala"), "ASC"]] })
    .then(function (data) {
      return data;
    })
    .catch((error) => {
      return error;
    });
  res.json({ success: true, data: data });
};

controllers.listActiveSalasByCenterId = async (req, res) => {
  const { id } = req.params;
  const data = await salasModel
    .findAll({
      where: {
        activeStatus: true,
        id_centro: id,
      },
    })
    .then(function (data) {
      return data;
    })
    .catch((error) => {
      return error;
    });
  res.json({ success: true, data: data });
};

controllers.listaActiveSalasByHorario = async (req, res) => {
  const { idCentro, participantes, dia, inicio, fim } = req.params;

  var quarry = `
    SELECT
    "Salas"."id_sala" as "id_sala",
    "Salas"."nomesala" as "nomesala",
    "Salas"."descricao" as "descricao",
    "Salas"."alocacao_maxima" AS "alocacao_maxima", 
    "Salas"."alocacao_percent" AS "alocacao_percent",
    "Salas"."tempo_limpeza" as "tempo_limpeza",   
    cast(cast('${fim}' as interval) as time) + "Salas"."tempo_limpeza"*60::text::interval::time AS "verdadeiro_final", 
    "Reservas"."id_reserva" as "id_reserva"
  FROM "Salas"
  LEFT JOIN "Reservas"
    ON "Salas"."id_sala" = "Reservas"."id_sala"
    AND "Reservas"."dataReserva" = '${dia}'
    AND "Reservas"."horaFim" > '${inicio}' 
    AND "Reservas"."horaInicio" < cast(cast('${fim}' as interval) as time) + "Salas"."tempo_limpeza"*60::text::interval::time
    AND "Reservas"."cancelado" = false
  WHERE
    "Salas"."id_centro" = '${idCentro}'
    AND "Salas"."alocacao_maxima"*"Salas"."alocacao_percent"/100 >= '${participantes}'
  `;

  var toSend = [];

  const data = await db.sequelize
    .query(quarry, { type: QueryTypes.SELECT })
    .then(function (data) {
      data
        ?.filter((sala, index) => {
          if (sala.id_reserva == null) {
            return true;
          }
          return false;
        })
        .map((sala, index) => {
          toSend.push(sala);
        });
      res.json({ success: true, data: toSend });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.listaActiveSalasByHorarioByReserva = async (req, res) => {
  const { idCentro, participantes, dia, inicio, fim, idReserva } = req.params;

  var quarry = `
    SELECT
    "Salas"."id_sala" as "id_sala",
    "Salas"."nomesala" as "nomesala",
    "Salas"."descricao" as "descricao",
    "Salas"."alocacao_maxima" AS "alocacao_maxima", 
    "Salas"."alocacao_percent" AS "alocacao_percent",
    "Salas"."tempo_limpeza" as "tempo_limpeza",   
    cast(cast('${fim}' as interval) as time) + "Salas"."tempo_limpeza"*60::text::interval::time AS "verdadeiro_final", 
    "Reservas"."id_reserva" as "id_reserva"
  FROM "Salas"
  LEFT JOIN "Reservas"
    ON "Salas"."id_sala" = "Reservas"."id_sala"
    AND "Reservas"."dataReserva" = '${dia}'
    AND "Reservas"."horaFim" > '${inicio}' 
    AND "Reservas"."horaInicio" < cast(cast('${fim}' as interval) as time) + "Salas"."tempo_limpeza"*60::text::interval::time
    AND "Reservas"."cancelado" = false
    AND "Reservas"."id_reserva" != ${idReserva}
  WHERE
    "Salas"."id_centro" = '${idCentro}'
    AND "Salas"."alocacao_maxima"*"Salas"."alocacao_percent"/100 >= '${participantes}'
  `;

  var toSend = [];

  const data = await db.sequelize
    .query(quarry, { type: QueryTypes.SELECT })
    .then(function (data) {
      data
        ?.filter((sala, index) => {
          if (sala.id_reserva == null) {
            return true;
          }
          return false;
        })
        .map((sala, index) => {
          toSend.push(sala);
        });
      res.json({ success: true, data: toSend });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.listUniqueAlocacao_maxima = async (req, res) => {
  const data = await salasModel
    .findAll({
      attributes: [[sequelize.fn("DISTINCT", sequelize.col("alocacao_maxima")), "alocacao_maxima"]],
      where: { activeStatus: true },
      order: [[sequelize.col("alocacao_maxima"), "DESC"]],
    })
    .then(function (data) {
      return data;
    })
    .catch((error) => {
      return error;
    });
  res.json({ success: true, data: data });
};

controllers.getSala = async (req, res) => {
  const { id } = req.params;
  const data = salasModel
    .findOne({ where: { id_sala: id } })
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.updateSala = async (req, res) => {
  const { id } = req.params;
  const data = salasModel
    .update(
      {
        nomesala: req.body.nomesala,
        descricao: req.body.descricao,
        alocacao_maxima: req.body.alocacao_maxima,
        alocacao_percent: req.body.alocacao_percent,
        tempo_limpeza: req.body.tempo_limpeza,
        activeStatus: req.body.activeStatus,
        id_centro: req.body.id_centro,
      },
      { where: { id_sala: id } }
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
  const data = salasModel
    .update(
      {
        activeStatus: req.body.activeStatus,
      },
      { where: { id_sala: id } }
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
