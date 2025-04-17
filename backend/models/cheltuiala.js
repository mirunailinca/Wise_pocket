const cheltuialaModel = (sequelize, DataTypes ) =>{
    const cheltuiala = sequelize.define("cheltuiala",{
        id:{
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncreement: true
        },
        suma:{
            type: DataTypes.FLOAT,
            allowNull: false
        },
        data:{
            type: DataTypes.DATE,
            allowNull: false
        },
        detalii:{
            type: DataTypes.TEXT,
            allowNull: false
        }
    })
    return cheltuiala;
}

module.exports = cheltuialaModel