const { DataTypes } = require('sequelize');

module.exports = (sequelize, type) => {
  return sequelize.define('RolGruposAccion', 
    {
      RolId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      ServicioEjecId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      }
    },
    {
      sequelize,
      modelName: 'RolGruposAccion',
      tableName: 'RolGruposAccion',
      schema: 'psp',
    })
}
