const { DataTypes } = require('sequelize');

module.exports = (sequelize, type) => {
    return sequelize.define('RolRequest', 
      {
        RolId: {
            primarykey: true,
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          Url: {
            primarykey: true,
            type: DataTypes.STRING,
            allowNull: false,
          },
          Method: {
            primarykey: true,
            type: DataTypes.STRING,
            allowNull: false,
          },
      },
      {
        sequelize,
        modelName: 'RolRequest',
        tableName: 'RolRequests',
        schema: 'auth',
        paranoid: true
      })
  }