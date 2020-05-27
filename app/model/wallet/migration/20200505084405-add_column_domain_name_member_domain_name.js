'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('member_transaction_his')
          .then(tableDefinition => {
            if (tableDefinition['member_domain_name']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('member_transaction_his', 'member_domain_name', {
              type: Sequelize.DataTypes.STRING(256)
            });
          }),
        queryInterface.describeTable('member_transaction_his')
          .then(tableDefinition => {
            if (tableDefinition['domain_name']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('member_transaction_his', 'domain_name', {
              type: Sequelize.DataTypes.STRING(256)
            });
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
