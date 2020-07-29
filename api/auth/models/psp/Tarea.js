const { DataTypes } = require('sequelize');


module.exports = (sequelize, type) => {
  return sequelize.define('Tarea', 
    {
      Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'TareaId'
      },
      PPM: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'PPM_CODE',
        unique: 'PPM_Equipo'
      },
      Equipo:{
        type: DataTypes.STRING(80),
        unique: 'PPM_Equipo'
      },
      Descr: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      Frecuencia: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Periodo: {
        type: DataTypes.CHAR,
      }
    },
    {
      sequelize,
      modelName: 'Tarea',
      tableName: 'Tareas',
      schema: 'psp',
    })
}
