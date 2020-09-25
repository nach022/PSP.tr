const { DataTypes } = require('sequelize');


module.exports = (sequelize, type) => {
  return sequelize.define('EjecucionFuturaTarea', 
    {
      Estado: {
        type: DataTypes.STRING(4),
        allowNull: false
      },
      FechaInicio: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'EjecucionFuturaTarea',
      tableName: 'EjecucionesFuturasTareas',
      schema: 'psp',
    })
}
