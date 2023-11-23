module.exports = (sequelize, DataTypes) => {
    const tipoUtilizador = sequelize.define("TipoUtilizador",
        {
            id_tipoUtilizador: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,},
            descricao: { type: DataTypes.STRING, allowNull: false },
        },
        {
            tableName: "TipoUtilizador",
            timestamps: false,
        }
    );
    return tipoUtilizador;
};