const nconf = require('nconf')

nconf.env()
nconf.file('defaults', 'default-config.json')

module.exports = nconf
