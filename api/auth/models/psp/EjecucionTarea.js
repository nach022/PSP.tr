const { DataTypes } = require('sequelize');


module.exports = (sequelize, type) => {
  return sequelize.define('EjecucionTarea', 
    {
      OT: {
        type: DataTypes.STRING(30),
        allowNull: false,
        primaryKey: true
      },
      Estado: {
        type: DataTypes.STRING(4),
        allowNull: false
      },
      Fecha:{
        type: DataTypes.DATE,
        allowNull: false
      },
      FechaInicio: {
        type: DataTypes.DATE,
        allowNull: true
      },
      FechaFin: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'EjecucionTarea',
      tableName: 'EjecucionesTareas',
      schema: 'psp',
    })
}
