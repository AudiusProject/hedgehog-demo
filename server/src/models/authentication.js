'use strict'
module.exports = (sequelize, DataTypes) => {
  const Authentication = sequelize.define('Authentication', {
    iv: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cipherText: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lookupKey: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  })

  return Authentication
}
