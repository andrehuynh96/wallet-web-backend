'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
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
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('member_reward_transaction_his')
          .then(async (tableDefinition) => {
            if (tableDefinition['platform']) {
              return Promise.resolve();
            }

            return queryInterface.addColumn('member_reward_transaction_his', 'platform', {
              type: Sequelize.DataTypes.STRING(32),
              allowNull: false,
              defaultValue: 'ETH'
            });
          })
      ]);
    });
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('member_reward_transaction_his', 'platform', { transaction: t }),
      ]);
    });
  }
};
