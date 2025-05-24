const bugetModel = (sequelize, DataTypes) => {
    const buget = sequelize.define("buget", {
        id:{
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        totalitate_cheltuieli:{
            type: DataTypes.BIGINT,
            allowNull: false
        },
        perioada:{
            type: DataTypes.STRING,
            allowNull: false
        },
        suma:{
            type: DataTypes.FLOAT,
            allowNull: false
        },
        data_inceput:{
            type: DataTypes.DATE,
            allowNull: false
        },

    },{
        
        underscored: true,
        freezeTableName: true
    })
    return buget;
}

module.exports = bugetModel