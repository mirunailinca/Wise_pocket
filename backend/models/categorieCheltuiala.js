const categorieCheltuialaModel = (sequelize, DataTypes) => {
    const categorieCheltuiala = sequelize.define("categorie_cheltuiala", {
        id:{
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        denumire:{
            type: DataTypes.STRING,
            allowNull: false
        }
    },{
        underscored: true,
        freezeTableName: true
    })
    return categorieCheltuiala;
}

module.exports = categorieCheltuialaModel