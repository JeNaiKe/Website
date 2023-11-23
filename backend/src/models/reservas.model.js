module.exports = (sequelize, DataTypes) => {
    const Reserva = sequelize.define("Reservas",
        {
            id_reserva: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,unique: true,},
            dataReserva: { type: DataTypes.DATEONLY, allowNull: false },
            horaInicio: { type: DataTypes.TIME, allowNull: false },
            horaFim: { type: DataTypes.TIME, allowNull: false },
            descricao: { type: DataTypes.STRING, allowNull: false },
            cancelado: { type: DataTypes.BOOLEAN, allowNull: false },
            nr_participantes: { type: DataTypes.INTEGER, allowNull: false },
            id_utilizador: { type: DataTypes.INTEGER, allowNull: false },
            id_sala: { type: DataTypes.INTEGER, allowNull: false },
        },
        {
            tableName: "Reservas",
            timestamps: false,
        }
    );
    return Reserva;
};