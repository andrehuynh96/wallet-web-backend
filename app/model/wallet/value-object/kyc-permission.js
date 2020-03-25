const Permission = require('./permission-key');
module.exports = {
  1: [Permission.GENERATE_WALLET, Permission.IMPORT_WALLET],
  2: [Permission.GENERATE_WALLET, Permission.IMPORT_WALLET, Permission.STAKING],
  3: [Permission.GENERATE_WALLET, Permission.IMPORT_WALLET, Permission.STAKING, Permission.GENERATE_AFFILIATE_CODE, Permission.AFFILIATE_REWARD]
}