const database = require('app/lib/database');
const logger = require('app/lib/logger');

module.exports = {
  init: () => {
    require("./staking");
    database.db().staking.sync({ force: false }).then(() => {
      logger.info('Resync staking data model and do not drop any data');
    });
  }
}