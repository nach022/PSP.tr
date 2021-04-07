const { DataTypes } = require('sequelize');

module.exports = (sequelize, ) => {
  return sequelize.define('FamiliaVariables', 
    {
      Codigo: {
        type: DataTypes.STRING(8),
        allowNull: false,
        primaryKey: true,
        len: [2,8]
      },
      Nombre: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        len: [3,30]
      }
    },
    {
      sequelize,
      modelName: 'FamiliaVariables',
      tableName: 'FamiliasVariables',
      schema: 'pirai',
    })
}
