const { DataTypes } = require('sequelize');

module.exports = (sequelize, ) => {
  return sequelize.define('Profundidad', 
    {
      Codigo: {
        type: DataTypes.STRING(10),
        allowNull: false,
        primaryKey: true,
        len: [2,10]
      },
      Descripcion: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        len: [3,50]
      },
      Orden: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      }
    },
    {
      sequelize,
      modelName: 'Profundidad',
      tableName: 'Profundidades',
      schema: 'pirai',
    })
}
