const { DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize, type) => {
  return sequelize.define('ComentarioTarea', 
    {
      Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'ComentarioId'
      },
      Comentario: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        field: 'Comentario',
      },
    },
    {
      sequelize,
      modelName: 'ComentarioTarea',
      tableName: 'ComentariosTareas',
      schema: 'psp',
    })
}
