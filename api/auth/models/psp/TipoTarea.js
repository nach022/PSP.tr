const { DataTypes } = require('sequelize');

module.exports = (sequelize, type) => {
  return sequelize.define('TipoTarea', 
    {
      Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'TipoTareaId'
      },
      Nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'TipoTareaNombre',
      },
    },
    {
      sequelize,
      modelName: 'TipoTarea',
      tableName: 'TiposTareas',
      schema: 'psp',
    })
}
