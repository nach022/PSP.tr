const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = (sequelize, type) => {
  return sequelize.define('App', 
    {
      Id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        field: 'AppId'
      },
      Nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'AppName',
        len: [2,50]
      },
      Descr: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: 'App',
      schema: 'auth',
      paranoid: true
    })
}

