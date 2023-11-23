const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const utilizador = sequelize.define(
    "Utilizadores",
    {
      id_utilizador: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      primeironome: { type: DataTypes.STRING, allowNull: false },
      sobrenome: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      passwordprecisaupdate: { type: DataTypes.BOOLEAN, allowNull: false },
      emailconfirmado: { type: DataTypes.BOOLEAN, allowNull: false },
      activeStatus: { type: DataTypes.BOOLEAN, allowNull: false },
      id_centro: { type: DataTypes.INTEGER, allowNull: false },
      id_tipoUtilizador: { type: DataTypes.INTEGER, allowNull: false },
      id_permissao: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: "Utilizadores",
      timestamps: false,
    }
  );

  utilizador.beforeCreate((user, options) => {
    console.log("A encryptar...");
    return bcrypt
      .hash(user.password, 10)
      .then((hash) => {
        user.password = hash;
      })
      .catch((err) => {
        console.log("ERRO A ENCRYPTAR: " + err);
        throw new Error();
      });
  });
  return utilizador;
};
