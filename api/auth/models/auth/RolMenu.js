const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = (sequelize, type) => {
    return sequelize.define('RolMenu', 
      {
        RolId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          MenuItemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
      },
      {
        sequelize,
        modelName: 'RolMenu',
        tableName: 'RolMenues',
        schema: 'auth',
        paranoid: true
      })
  }