const { DataTypes } = require('sequelize');

module.exports = (sequelize, type) => {
  return sequelize.define('MenuItem', 
    {
        Id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            field: 'MenuItemId'
        },
        AppId:{
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'AppId',
            unique: 'AppLabel'
        },
        Label: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: 'AppLabel',
            field: 'Label',
            len: [2,50]
        },
        Icono: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        Estilo: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        Tipo: {
            type: DataTypes.CHAR,
            allowNull: false,
            field: 'Tipo',
        },
        Route: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'Route',
        },
        Padre: {
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: 'AppLabel',
            field: 'PadreId',
        },
        Orden:{
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'MenuItem',
        schema: 'app',
        paranoid: true
    })
}
