//loads the correct configuration file
module.exports = require('./env/' + process.env.NODE_ENV + '.js');