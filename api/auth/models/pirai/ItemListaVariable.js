const { DataTypes } = require('sequelize');

module.exports = (sequelize, ) => {
  return sequelize.define('ItemListaVariable', 
    {
      CodigoVariable: {
        type: DataTypes.STRING(8),
        allowNull: false,
        primaryKey: true,
        len: [1,8],
        unique: 'ordenValor'
      },
      ValorPosible: {
        type: DataTypes.STRING(20),
        allowNull: false,
        primaryKey: true,
        len: [1,20]
      },
      Orden: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'ordenValor'
      }
    },
    {
      sequelize,
      modelName: 'ItemListaVariable',
      tableName: 'ItemsListaVariable',
      schema: 'pirai',
    })
}
