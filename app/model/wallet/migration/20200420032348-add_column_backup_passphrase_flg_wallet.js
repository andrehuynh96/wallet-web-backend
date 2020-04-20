'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('wallets', 'backup_passphrase_flg', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: false
        }, { transaction: t }),
        queryInterface.addColumn('wallets_his', 'backup_passphrase_flg', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: false
        }, { transaction: t })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('wallets', 'backup_passphrase_flg', { transaction: t }),
        queryInterface.removeColumn('wallets_his', 'backup_passphrase_flg', { transaction: t })
      ]);
    });
  }
};
