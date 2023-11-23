module.exports = (sequelize, DataTypes) => {
    const permissaoUtilizador = sequelize.define("PermissoesUtilizador",
        {
            id_permissao: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,},
            descricao: { type: DataTypes.STRING, allowNull: false },
        },
        {
            tableName: "PermissoesUtilizador",
            timestamps: false,
        }
    );
    return permissaoUtilizador;
};