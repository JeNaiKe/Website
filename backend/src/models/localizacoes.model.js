module.exports = (sequelize, DataTypes) => {
    const localizacoes = sequelize.define("Localizacoes",
        {
            id_local: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,},
            freguesia: { type: DataTypes.STRING, allowNull: false },
            distrito: { type: DataTypes.STRING, allowNull: false },
            codigopostal: { type: DataTypes.STRING, allowNull: false },
        },
        {
            tableName: "Localizacoes",
            timestamps: false,
        }
    );
    return localizacoes;
};