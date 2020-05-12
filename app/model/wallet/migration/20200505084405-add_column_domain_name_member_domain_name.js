'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('member_transaction_his', 'member_domain_name', {
          type: Sequelize.DataTypes.STRING(256)
        }, { transaction: t }),
        queryInterface.addColumn('member_transaction_his', 'domain_name', {
          type: Sequelize.DataTypes.STRING(256)
        }, { transaction: t })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('member_transaction_his', 'member_domain_name', { transaction: t }),
        queryInterface.removeColumn('member_transaction_his', 'domain_name', { transaction: t })
      ]);
    });
  }
};
