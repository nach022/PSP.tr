const { DataTypes } = require('sequelize');

module.exports = (sequelize, type) => {
  return sequelize.define('ServicioEjecutor', 
    {
      Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'ServicioEjecId'
      },
      Nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        len: [3,50]
      }
    },
    {
      sequelize,
      modelName: 'ServicioEjecutor',
      tableName: 'ServiciosEjec',
      schema: 'psp',
    })
}
