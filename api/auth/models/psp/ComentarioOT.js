const { DataTypes } = require('sequelize');

module.exports = (sequelize, type) => {
  return sequelize.define('ComentarioOT', 
    {
      Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'ComentarioId'
      },
      Comentario: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'Comentario',
      },
      Usuario: {
        type: DataTypes.STRING(80),
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: 'ComentarioOT',
      tableName: 'ComentariosOTs',
      schema: 'psp',
    })
}
