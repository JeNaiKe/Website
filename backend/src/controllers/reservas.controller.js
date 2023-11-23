var models = require("../models/index");
const jwt = require("jsonwebtoken");
const reservasModel = models.reservas;
const salasModel = models.salas;
const utilizadorModel = models.utilizador;
const sequelize = require("sequelize");
const db = require("../models");
const { QueryTypes } = require("sequelize");

const controllers = {};
controllers.list = async (req, res) => {
  const data = await reservasModel
    .findAll({
      order: [[sequelize.col("id_reserva"), "ASC"]],
    })
    .then(function (data) {
      return data;
    })
    .catch((error) => {
      return error;
    });
  res.json({ success: true, data: data });
};

controllers.getByID = async (req, res) => {
  const { id } = req.params;
  const data = reservasModel
    .findOne({ where: { id_reserva: id } })
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.getBySalaID = async (req, res) => {
  const { id } = req.params;
  const data = reservasModel
    .findOne({
      where: { id_sala: id },
      order: [[sequelize.col("id_reserva"), "ASC"]],
    })
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.getByUserToken = async (req, res) => {
  let decoded;
  if (req.params.id) {
    try {
      decoded = jwt.decode(req.params.id);
    } catch (e) {
      return res.status(401).send("unauthorized");
    }
  }
  const data = reservasModel
    .findAll({
      where: { id_utilizador: decoded.id },
      order: [[sequelize.col("id_reserva"), "ASC"]],
    })
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.getByUserTokenOnwards = async (req, res) => {
  let decoded;
  if (req.params.id) {
    try {
      decoded = jwt.decode(req.params.id);
    } catch (e) {
      return res.status(401).send("unauthorized");
    }
  }

  const dataAgora = new Date().toLocaleDateString("af-ZA", {
    timeZone: "Europe/Lisbon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const horaAgora = new Date()
    .toLocaleDateString("af-ZA", {
      timeZone: "Europe/Lisbon",
      hour: "2-digit",
      minute: "2-digit",
    })
    .slice(11, 16);

  const data = reservasModel
    .findAll({
      where: {
        cancelado: false,
        id_utilizador: decoded.id,
        [sequelize.Op.or]: [
          {
            dataReserva: dataAgora,
            horaFim: { [sequelize.Op.gt]: horaAgora },
          },
          { dataReserva: { [sequelize.Op.gt]: dataAgora } },
        ],
      },
      order: [
        [sequelize.col("dataReserva"), "ASC"],
        [sequelize.col("horaFim"), "ASC"],
      ],
    })
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.getSalaMostPopular = async (req, res) => {
  const data = reservasModel
    .findAll({
      include: [
        {
          model: salasModel,
          required: true,
        },
      ],
      attributes: ["Sala.nomesala"],
      group: ["Reservas.id_sala", "Reservas.id_reserva", "Sala.id_sala"],
      order: [[sequelize.fn("COUNT", sequelize.col("id_reserva"))], [sequelize.col("id_reserva"), "DESC"]],
      limit: "1",
    })
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.qtyReservasByDate = async (req, res) => {
  const { dataIncial, dataFinal } = req.query;

  const data = reservasModel
    .findAll({
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("*")), "y"],
        [sequelize.col("Reservas.dataReserva"), "x"],
      ],
      where: { dataReserva: { [sequelize.Op.between]: [dataIncial, dataFinal] } },
      group: ["Reservas.dataReserva"],
      order: [[sequelize.col("Reservas.dataReserva"), "ASC"]],
    })
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.getListByDateInterval = async (req, res) => {
  const { dataIncial, dataFinal } = req.query;

  const data = reservasModel
    .findAll({
      include: [
        {
          model: salasModel,
          required: true,
          attributes: ["nomesala"],
        },
        {
          model: utilizadorModel,
          required: true,
          attributes: ["primeironome", "sobrenome"],
        },
      ],
      attributes: [
        [sequelize.col("Reservas.id_reserva"), "id_reserva"],
        [sequelize.col("Reservas.dataReserva"), "dataReserva"],
        [sequelize.col("Reservas.horaInicio"), "horaInicio"],
        [sequelize.col("Reservas.horaFim"), "horaFim"],
        [sequelize.col("Reservas.descricao"), "descricao"],
        [sequelize.col("Reservas.cancelado"), "cancelado"],
        [sequelize.col("Reservas.nr_participantes"), "nr_participantes"],
      ],
      where: {
        dataReserva: { [sequelize.Op.between]: [dataIncial, dataFinal] },
      },
      order: [[sequelize.col("Reservas.dataReserva"), "ASC"]],
    })
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.getListByDateIntervalByCenter = async (req, res) => {
  const { dataIncial, dataFinal, idCentro } = req.query;

  const data = reservasModel
    .findAll({
      include: [
        {
          model: salasModel,
          required: true,
          attributes: ["nomesala"],
          where: { id_centro: idCentro },
        },
        {
          model: utilizadorModel,
          required: true,
          attributes: ["primeironome", "sobrenome"],
        },
      ],
      attributes: [
        [sequelize.col("Reservas.id_reserva"), "id_reserva"],
        [sequelize.col("Reservas.dataReserva"), "dataReserva"],
        [sequelize.col("Reservas.horaInicio"), "horaInicio"],
        [sequelize.col("Reservas.horaFim"), "horaFim"],
        [sequelize.col("Reservas.descricao"), "descricao"],
        [sequelize.col("Reservas.cancelado"), "cancelado"],
        [sequelize.col("Reservas.nr_participantes"), "nr_participantes"],
      ],
      where: {
        dataReserva: { [sequelize.Op.between]: [dataIncial, dataFinal] },
      },
      order: [[sequelize.col("Reservas.dataReserva"), "ASC"]],
    })
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.percentAllocationMonthly = async (req, res) => {
  const dataIncial = new Date();
  const dataFinal = new Date();

  dataIncial.setDate(dataIncial.getDate() - 15);
  dataFinal.setDate(dataFinal.getDate() + 15);

  var querySub = 'round( count(*)::float *1000/(select count(*) from public."Reservas" WHERE "dataReserva"  BETWEEN ';
  querySub += "'" + dataIncial.toISOString().slice(0, 10) + "' and '" + dataFinal.toISOString().slice(0, 10) + "'))/10";

  const data = reservasModel
    .findAll({
      attributes: [
        [sequelize.literal(querySub), "y"],
        [sequelize.col("Reservas.dataReserva"), "x"],
      ],
      where: { dataReserva: { [sequelize.Op.between]: [dataIncial, dataFinal] } },
      group: ["Reservas.dataReserva"],
      order: [[sequelize.col("Reservas.dataReserva"), "ASC"]],
    })
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.percentMostUsedSalasByCapacity = async (req, res) => {
  const { id } = req.params;

  var querySub = 'round( COUNT(*)::float *1000/( SELECT COUNT(*) FROM "Reservas" inner join "Salas" ON "Reservas"."id_sala" = "Salas"."id_sala"';
  querySub += ' WHERE "Salas"."alocacao_maxima" = ' + id.toString() + "))/10";

  const data = reservasModel
    .findAll({
      include: {
        model: salasModel,
        required: true,
        where: { alocacao_maxima: id },
        attributes: [],
      },
      attributes: [
        [sequelize.literal(querySub), "y"],
        [sequelize.col("Sala.nomesala"), "x"],
      ],
      group: ["Sala.id_sala"],
      order: [[sequelize.col("y"), "DESC"]],
    })
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.getListBySalaByDate = async (req, res) => {
  const id = req.params.id;
  const dataRecebida = req.params.dataRecebida;
  const data = reservasModel
    .findAll({
      include: {
        model: utilizadorModel,
        required: true,
        attributes: ["primeironome", "sobrenome"],
      },
      where: { dataReserva: { [sequelize.Op.between]: [dataRecebida, dataRecebida] }, id_sala: id },
      order: [
        [sequelize.col("dataReserva"), "ASC"],
        [sequelize.col("horaInicio"), "ASC"],
      ],
    })
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.getListBySalaToday = async (req, res) => {
  const { id } = req.params;

  const dataIncial = new Date();

  const data = reservasModel
    .findAll({
      include: {
        model: utilizadorModel,
        required: true,
        attributes: ["primeironome", "sobrenome"],
      },
      where: { dataReserva: { [sequelize.Op.between]: [dataIncial, dataIncial] }, id_sala: id },
      order: [
        [sequelize.col("dataReserva"), "ASC"],
        [sequelize.col("horaInicio"), "ASC"],
      ],
    })
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.getListBySalaTodayOnward = async (req, res) => {
  const { id } = req.params;

  const horaAgora = new Date()
    .toLocaleDateString("af-ZA", {
      timeZone: "Europe/Lisbon",
      hour: "2-digit",
      minute: "2-digit",
    })
    .slice(11, 16);

  const dataIncial = new Date();

  const data = reservasModel
    .findAll({
      limit: 6,
      include: {
        model: utilizadorModel,
        required: true,
        attributes: ["primeironome", "sobrenome"],
      },
      where: {
        cancelado: false,
        id_sala: id,
        dataReserva: { [sequelize.Op.between]: [dataIncial, dataIncial] },
        horaFim: { [sequelize.Op.gt]: horaAgora },
      },
      order: [
        [sequelize.col("dataReserva"), "ASC"],
        [sequelize.col("horaInicio"), "ASC"],
      ],
    })
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.getListBySalaTodayTomorrow = async (req, res) => {
  const { id } = req.params;

  const dataIncial = new Date();
  const dataFinal = new Date();

  dataFinal.setDate(dataFinal.getDate() + 1);

  const data = reservasModel
    .findAll({
      include: [
        {
          model: salasModel,
          required: true,
          attributes: ["nomesala", "tempo_limpeza"],
        },
        {
          model: utilizadorModel,
          required: true,
          attributes: ["primeironome", "sobrenome"],
        },
      ],
      where: { dataReserva: { [sequelize.Op.between]: [dataIncial, dataFinal] }, id_sala: id },
      order: [
        [sequelize.col("dataReserva"), "ASC"],
        [sequelize.col("horaInicio"), "ASC"],
      ],
    })
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.getListByCentroTodayTomorrow = async (req, res) => {
  const { id } = req.params;

  const dataIncial = new Date();
  const dataFinal = new Date();

  dataFinal.setDate(dataFinal.getDate() + 1);

  const data = reservasModel
    .findAll({
      include: [
        {
          model: salasModel,
          required: true,
          attributes: ["nomesala", "tempo_limpeza"],
          where: { id_centro: id },
        },
        {
          model: utilizadorModel,
          required: true,
          attributes: ["primeironome", "sobrenome"],
        },
      ],
      where: { dataReserva: { [sequelize.Op.between]: [dataIncial, dataFinal] } },
      order: [
        [sequelize.col("dataReserva"), "ASC"],
        [sequelize.col("id_sala"), "ASC"],
        [sequelize.col("horaInicio"), "ASC"],
      ],
    })
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.getListByLimpezaNew = async (req, res) => {
  const { id } = req.params;

  const dataHoje = new Date().toLocaleDateString("af-ZA", {
    timeZone: "Europe/Lisbon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  quarry = `
    
  `;

  var toSend = [];

  const data = await db.sequelize
    .query(quarry, { type: QueryTypes.SELECT })
    .then(function (data) {
      toSend = data;
      res.json({ success: true, data: toSend });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.getListByLimpeza = async (req, res) => {
  const { id } = req.params;

  var queryu = ' "Reservas"."id_reserva", "Reservas"."horaFim",  "Reservas"."nr_participantes", "Salas"."nomesala" ';
  queryu += 'from "Reservas" Inner join "Salas" as "Salas" ON "Reservas"."id_sala" = "Salas"."id_sala" ';
  queryu += 'where current_time between "Reservas"."horaFim"::time - INTERVAL ' + "'1 min'" + ' * "Salas"."tempo_limpeza"  and "Reservas"."horaFim"::time';
  queryu += ' and "Reservas"."cancelado" = false and "Salas"."id_centro" = ' + id.toString();

  //const tempo = new Date().toLocaleTimeString();
  //const tempo = new Date().toLocaleDateString();
  //console.log(tempo);

  //fim < tempo + 10 (frontend
  //fim > tempo (backend)
  const dataIncial = new Date();

  const data = reservasModel
    .findAll({
      include: {
        model: salasModel,
        required: true,
        attributes: [],
        where: { id_centro: id },
      },
      attributes: [
        [sequelize.col("Reservas.id_reserva"), "id_reserva"],
        [sequelize.col("Sala.nomesala"), "nomesala"],
        [sequelize.col("Reservas.horaFim"), "horaFim"],
        [sequelize.col("Reservas.nr_participantes"), "nr_participantes"],
        [sequelize.col("Sala.tempo_limpeza"), "tempo_limpeza"],
      ],
      where: {
        dataReserva: { [sequelize.Op.between]: [dataIncial, dataIncial] },
        cancelado: false,
        horaFim: {
          [sequelize.Op.gt]: new Date(),
        },
      },
      order: [[sequelize.col("horaFim"), "ASC"]],
    })
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.getListBySalaIDHoraInicioDate = async (req, res) => {
  const { salaId, horaInicio, dataReserva } = req.params;

  const quarry = `
  SELECT 
	* 
  FROM "Reservas"
  WHERE 
  "cancelado" = false 
	AND "id_sala" = ${salaId}
	AND (
		("dataReserva" = '${dataReserva}' and "horaInicio" > '${horaInicio}')
		or
		("dataReserva" > '${dataReserva}')
	)
  ORDER BY
	"dataReserva", "horaInicio"
  `;

  const data = await db.sequelize
    .query(quarry, { type: QueryTypes.SELECT })
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.register = async (req, res) => {
  const data = reservasModel
    .create({
      dataReserva: req.body.data,
      horaInicio: req.body.horaInicio,
      horaFim: req.body.horaFim,
      descricao: req.body.descricao,
      cancelado: false,
      nr_participantes: req.body.nr_participantes,
      id_utilizador: req.body.id_utilizador,
      id_sala: req.body.id_sala,
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
  const data = reservasModel
    .destroy({ where: { id_reserva: id } })
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.updateReserva = async (req, res) => {
  const { id } = req.params;
  const data = reservasModel
    .update(
      {
        data: req.body.data,
        horaInicio: req.body.horaInicio,
        horaFim: req.body.horaFim,
        nr_participantes: req.body.nr_participantes,
      },
      { where: { id_reserva: id } }
    )
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.cancelarReserva = async (req, res) => {
  const { id } = req.params;
  const dataAgora = new Date().toLocaleDateString("af-ZA", {
    timeZone: "Europe/Lisbon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const horaAgora = new Date()
    .toLocaleDateString("af-ZA", {
      timeZone: "Europe/Lisbon",
      hour: "2-digit",
      minute: "2-digit",
    })
    .slice(11, 16);

  const data = reservasModel
    .update(
      {
        cancelado: true,
      },
      {
        where: {
          id_reserva: id,
          [sequelize.Op.or]: {
            dataReserva: { [sequelize.Op.gt]: dataAgora },
            [sequelize.Op.and]: {
              dataReserva: dataAgora,
              horaInicio: { [sequelize.Op.gt]: horaAgora },
            },
          },
        },
      }
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
