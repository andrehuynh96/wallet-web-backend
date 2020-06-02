'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('wallets')
          .then(tableDefinition => {
            if (tableDefinition['backup_passphrase_flg']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('wallets', 'backup_passphrase_flg', {
              type: Sequelize.DataTypes.BOOLEAN,
              defaultValue: false
            })
          })
        ,
        queryInterface.describeTable('wallets_his')
          .then(tableDefinition => {
            if (tableDefinition['backup_passphrase_flg']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('wallets_his', 'backup_passphrase_flg', {
              type: Sequelize.DataTypes.BOOLEAN,
              defaultValue: false
            })
          })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
       Add reverting commands here.
       Return a promise to correctly handle asynchronicity.
 
       Example:
       return queryInterface.dropTable('users');
     */
  }
};
