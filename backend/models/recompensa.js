const recompensaModel = (sequelize,DataTypes)=> {
    const recompensa = sequelize.define("recompensa",{
        id:{
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        puncte:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },{
        underscored: true,
        freezeTableName: true
    })
    return recompensa;
}

module.exports = recompensaModel