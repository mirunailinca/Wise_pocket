const Sequelize = require("sequelize")
const sequelize = new Sequelize("wise_pocket", "root", "",{
    dialect:"mysql",
    host:"localhost",
    define: {
        charset: "utf8",
        collate: "utf8_general_ci",
        timeStamp: true,
        underscored: true,
        freezeTableName: true,
    }
})

module.exports=sequelize