const { DataTypes } = require('sequelize');

module.exports = (sequelize, ) => {
  return sequelize.define('Variable', 
    {
      Codigo: {
        type: DataTypes.STRING(8),
        allowNull: false,
        primaryKey: true,
        len: [1,8]
      },
      Nombre: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        len: [3,30]
      },
      Unidad: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      Minimo: {
        type: DataTypes.DECIMAL(15,3),
        allowNull: true,
      },
      Maximo: {
        type: DataTypes.DECIMAL(15,3),
        allowNull: true,
      },
      MinVis: {
        type: DataTypes.DECIMAL(15,3),
        allowNull: true,
      },
      MaxVis: {
        type: DataTypes.DECIMAL(15,3),
        allowNull: true,
      },
      Tipo: {
        type: DataTypes.STRING(3),
        allowNull: false,
        len: 3
      },
      TieneLQ: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      LQ: {
        type: DataTypes.DECIMAL(15,3),
        allowNull: true,
      },
      Campo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      Laboratorio: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      Automatica: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },

    },
    {
      sequelize,
      modelName: 'Variable',
      tableName: 'Variables',
      schema: 'pirai',
    })
}