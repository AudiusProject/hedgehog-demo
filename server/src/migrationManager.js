const Umzug = require('umzug')
const path = require('path')

const { sequelize } = require('./models')

function runMigrations () {
  const umzug = new Umzug({
    storage: 'sequelize',

    storageOptions: {
      sequelize: sequelize
    },

    migrations: {
      params: [
        sequelize.getQueryInterface(),
        sequelize.constructor
      ],
      path: path.join(__dirname, '../sequelize/migrations')
    }
  })
  return umzug.up()
}

module.exports = { runMigrations }
