const sequelize = require("sequelize")
const db = require("../config/db")

const categorieCheltuialaModel = require("./categorieCheltuiala")
const cheltuialaModel = require("./cheltuiala")
const bugetModel = require("./buget")
const utilizatorModel = require("./utilizator")
const recompensaModel = require("./recompensa")

const categorieCheltuiala = categorieCheltuialaModel(db,sequelize)
const cheltuiala = cheltuialaModel(db,sequelize)
const buget = bugetModel(db,sequelize)
const utilizator = utilizatorModel(db,sequelize) 
const recompensa = recompensaModel(db,sequelize) 

//legatura catChelt cu cheltuiala
categorieCheltuiala.hasMany(cheltuiala, { foreignKey: "categorie_cheltuiala_id" })
cheltuiala.belongsTo(categorieCheltuiala)


//legatura chelt utiliz
utilizator.hasMany(cheltuiala, { foreignKey: "utilizator_id" })
cheltuiala.belongsTo(utilizator)


//legatura buget utiliz
utilizator.hasMany(buget,{foreignKey: "utilizator_id"})
buget.belongsTo(utilizator)

//legatura recompensa utiliz
utilizator.hasMany(recompensa)
recompensa.belongsTo(utilizator)

module.exports = {
    categorieCheltuiala,
    cheltuiala,
    buget,
    utilizator,
    recompensa,
    db

}