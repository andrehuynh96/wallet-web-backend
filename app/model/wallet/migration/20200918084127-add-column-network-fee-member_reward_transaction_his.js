'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('member_reward_transaction_his')
          .then(tableDefinition => {
            if (tableDefinition['network_fee']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('member_reward_transaction_his', 'network_fee', {
              type: Sequelize.DataTypes.DECIMAL,
              allowNull: true
            });
          }),
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
