const dbConfig = require("../config/db.config.js");

const { Sequelize, DataTypes } = require("sequelize");
/*
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
}); 
*/

const sequelize = new Sequelize("postgres://jtghqnkdrqmeuu:f51270bf8213acda05c776dbbc64e21bd0b0aa7e72f2a16e5959b5551f014a2e@ec2-44-205-41-76.compute-1.amazonaws.com:5432/d4j7pe9jmbrl14", {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 10, //maximum number of connections in pool
    min: 0, //minimum number of connections in pool
    acquire: 30000, //maximum time (ms), that pool will try to get connection before throwing error
    idle: 10000, //maximum time (ms) that a connection can be idle before being released
  },
});

Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
  return this._applyTimezone(date, options).format("YYYY-MM-DD HH:mm:ss.SSS");
};

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

sequelize
  .sync()
  .then()
  .catch((error) => {
    console.log(error);
  });

const db = {};

db.sequelize = sequelize;

//Models criados
db.utilizador = require("./utilizador.model")(sequelize, DataTypes);
db.tipoutilizador = require("./tipoutilizador.model")(sequelize, DataTypes);
db.centros = require("./centros.model")(sequelize, DataTypes);
db.permissoesUtilizador = require("./permissoesutilizador.model")(sequelize, DataTypes);
db.localizacoes = require("./localizacoes.model")(sequelize, DataTypes);
db.salas = require("./salas.model")(sequelize, DataTypes);
db.reservas = require("./reservas.model")(sequelize, DataTypes);

//Tipo Utilizador
db.tipoutilizador.hasOne(db.utilizador, { foreignKey: "id_tipoUtilizador", targetKey: "id_tipoUtilizador" });
db.utilizador.belongsTo(db.tipoutilizador, { foreignKey: "id_tipoUtilizador", targetKey: "id_tipoUtilizador" });

//Centros
db.centros.hasOne(db.utilizador, { foreignKey: "id_centro", targetKey: "id_centro" });
db.utilizador.belongsTo(db.centros, { foreignKey: "id_centro", targetKey: "id_centro" });

//Permissoes Utilizador
db.permissoesUtilizador.hasOne(db.utilizador, { foreignKey: "id_permissao", targetKey: "id_permissao" });
db.utilizador.belongsTo(db.permissoesUtilizador, { foreignKey: "id_permissao", targetKey: "id_permissao" });

//Localizacoes
db.localizacoes.hasOne(db.centros, { foreignKey: "id_local", targetKey: "id_local" });
db.centros.belongsTo(db.localizacoes, { foreignKey: "id_local", targetKey: "id_local" });

//Salas - CHECK
db.centros.hasOne(db.salas, { foreignKey: "id_centro", targetKey: "id_centro" });
db.salas.belongsTo(db.centros, { foreignKey: "id_centro", targetKey: "id_centro" });

//Reservas(utilizador)
db.utilizador.hasOne(db.reservas, { foreignKey: "id_utilizador", targetKey: "id_utilizador" });
db.reservas.belongsTo(db.utilizador, { foreignKey: "id_utilizador", targetKey: "id_utilizador" });

//Reservas(salas)
db.salas.hasOne(db.reservas, { foreignKey: "id_sala", targetKey: "id_sala" });
db.reservas.belongsTo(db.salas, { foreignKey: "id_sala", targetKey: "id_sala" });

module.exports = db;
