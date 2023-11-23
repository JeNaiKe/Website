module.exports = (sequelize, DataTypes) => {
    const Sala = sequelize.define("Salas",
        {
            id_sala: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,},
            nomesala: { type: DataTypes.STRING, allowNull: false },
            descricao: { type: DataTypes.STRING, allowNull: false },
            alocacao_maxima: { type: DataTypes.INTEGER, allowNull: false },
            alocacao_percent: { type: DataTypes.INTEGER, allowNull: false },
            tempo_limpeza: { type: DataTypes.INTEGER, allowNull: false },
            activeStatus: { type: DataTypes.BOOLEAN, allowNull: false }, //Ativo / Inativo
            id_centro: { type: DataTypes.INTEGER, allowNull: false },
        },
        {
            tableName: "Salas",
            timestamps: false,
        }
    );
    return Sala;
};