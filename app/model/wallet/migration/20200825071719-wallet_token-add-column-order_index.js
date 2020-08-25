'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('wallet_tokens')
          .then(tableDefinition => {
            if (tableDefinition['order_index']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('wallet_tokens', 'order_index', {
              type: Sequelize.DataTypes.INTEGER,
              allowNull: true
            })
          })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('wallet_tokens', 'order_index', { transaction: t }),
      ]);
    });
  }
};

