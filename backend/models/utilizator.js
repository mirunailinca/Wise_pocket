const utilizatorModel = (sequelize, DataTypes) => {
    const utilizator = sequelize.define(
      "utilizator",
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        nume: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        prenume: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true, // email unic pentru autentificare
          validate: {
            isEmail: true,
          },
        },
        parola: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        rol: {
          type: DataTypes.ENUM("admin", "user"), // doar cele două roluri acceptate
          allowNull: false,
          defaultValue: "user", // implicit user
        },
      },
      {
        underscored: true,
        freezeTableName: true,
      }
    );
  
    return utilizator;
  };
  
  module.exports = utilizatorModel;
  