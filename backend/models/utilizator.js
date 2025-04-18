const utilizatorModel = (sequelize,DataTypes) => {
    const utilizator = sequelize.define("utilizator",{
        id:{
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        nume:{
            type: DataTypes.STRING,
            allowNull: false
        },
        prenume:{
            type: DataTypes.STRING,
            allowNull: false
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false
        },
        parola:{
            type: DataTypes.STRING,
            allowNull: false
        }
    },{
        
        underscored: true,
        freezeTableName: true
    })
    return utilizator;
}

module.exports = utilizatorModel