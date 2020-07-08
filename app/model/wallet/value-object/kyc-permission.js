const Permission = require('./permission-key');
module.exports = {
  LEVEL_0: [Permission.GENERATE_WALLET, Permission.IMPORT_WALLET, Permission.STAKING],
  LEVEL_1: [Permission.GENERATE_WALLET, Permission.IMPORT_WALLET, Permission.STAKING, Permission.GENERATE_AFFILIATE_CODE, Permission.AFFILIATE_REWARD],
  LEVEL_2: [Permission.GENERATE_WALLET, Permission.IMPORT_WALLET, Permission.STAKING, Permission.GENERATE_AFFILIATE_CODE, Permission.AFFILIATE_REWARD]
}