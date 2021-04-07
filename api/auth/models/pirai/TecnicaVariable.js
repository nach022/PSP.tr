const { DataTypes } = require('sequelize');

module.exports = (sequelize, ) => {
  return sequelize.define('TecnicaVariable', 
    {
        VariableCodigo: {
            type: DataTypes.STRING(8),
            allowNull: false,
            primaryKey: true,
            len: [1,8]
        },
        Origen: {
            type: DataTypes.STRING(3),
            primaryKey: true,
            allowNull: false
        },
        FechaEfectiva: {
            type: DataTypes.DATE,
            primaryKey: true,
            allowNull: false
        },
        Tecnica: {
            type: DataTypes.STRING(128),
            allowNull: true
        }
    },
    {
      sequelize,
      modelName: 'TecnicaVariable',
      tableName: 'TecnicasVariables',
      schema: 'pirai',
    })
}