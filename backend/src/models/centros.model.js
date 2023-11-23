module.exports = (sequelize, DataTypes) => {
    const centro = sequelize.define("Centros",
        {
            id_centro: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,},
            nomecentro: { type: DataTypes.STRING, allowNull: false },
            activeStatus: { type: DataTypes.BOOLEAN, allowNull: false },
            id_local: { type: DataTypes.INTEGER, allowNull: true },
        },
        {
            tableName: "Centros",
            timestamps: false,
        }
    );
    return centro;
};