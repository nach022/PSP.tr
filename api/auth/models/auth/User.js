const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = (sequelize, type) => {
  return sequelize.define('User', 
    {
      Legajo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'UserId'
      },
      Nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'UserName',
        len: [5,50]
      }
    },
    {
      sequelize,
      modelName: 'User',
      schema: 'auth',
      paranoid: true
    })
}
