const { DataTypes } = require('sequelize');

module.exports = (sequelize, ) => {
  return sequelize.define('Ubicacion', 
    {
      Codigo: {
        type: DataTypes.STRING(15),
        allowNull: false,
        primaryKey: true,
        len: [1,15]
      },
      Nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        len: [3,50]
      },
      Latitud: {
        type: DataTypes.DECIMAL(12,8),
        allowNull: false,
      },
      Longitud: {
        type: DataTypes.DECIMAL(12,8),
        allowNull: false,
      },
      Descripcion: {
        type: DataTypes.STRING(500),
        allowNull: true,
        len: 3
      },
      Imagen: {
        type: DataTypes.BLOB,
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: 'Ubicacion',
      tableName: 'Ubicaciones',
      schema: 'pirai',
    })
}