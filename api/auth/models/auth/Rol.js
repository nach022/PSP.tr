const { Sequelize, DataTypes, Model } = require('sequelize');
const App = require('./App');

module.exports = (sequelize, type) => {
  return sequelize.define('Rol', 
    {
      Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'RolId'
      },
      AppId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'appYrol',
      },
      Nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'RolName',
        unique: 'appYrol',
        len: [5,50]
      },
      Descr: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: 'Rol',
      tableName: 'Roles',
      schema: 'auth',
      paranoid: true
    })
}


