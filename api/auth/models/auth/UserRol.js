const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = (sequelize, type) => {
    return sequelize.define('UserRol', 
      {
          Legajo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'UserId',
          },
          RolId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          }
      },
      {
        sequelize,
        modelName: 'UserRol',
        tableName: 'UserRoles',
        schema: 'auth',
        paranoid: true
      })
  }
