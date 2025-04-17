const sequelize = require("sequelize")
const db = require("../config/db")

const categorieCheltuialaModel = require("./categorieCheltuiala")
const cheltuialaModel = require("./cheltuiala")

const categorieCheltuiala = categorieCheltuialaModel(db,sequelize)
const cheltuiala = cheltuialaModel(db,sequelize)

categorieCheltuiala.hasMany(cheltuiala)
cheltuiala.belongsTo(categorieCheltuiala)


module.exports = {
    categorieCheltuiala,
    cheltuiala,
    db,

}