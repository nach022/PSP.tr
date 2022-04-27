const { DataTypes } = require('sequelize');

module.exports = (sequelize, type) => {
  return sequelize.define('ComentarioOT', 
    {
      Linea: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      Fecha:{
        type: DataTypes.DATE,
        allowNull: false
      },
      Comentario: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'Comentario',
      },
      Usuario: {
        type: DataTypes.STRING(20),
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
