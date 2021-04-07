const { DataTypes } = require('sequelize');

module.exports = (sequelize, ) => {
  return sequelize.define('ProfundidadVariable', 
    {
      VariableCodigo: {
        type: DataTypes.STRING(8),
        allowNull: false,
        primaryKey: true,
        len: [1,8]
      },
      ProfundidadCodigo: {
        type: DataTypes.STRING(10),
        allowNull: false,
        primaryKey: true,
        len: [2,10]
      },
      Origen: {
        type: DataTypes.STRING(3),
        primaryKey: true,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'ProfundidadVariable',
      tableName: 'ProfundidadesVariables',
      schema: 'pirai',
    })
}
