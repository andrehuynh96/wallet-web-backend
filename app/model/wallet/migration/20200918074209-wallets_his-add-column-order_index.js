'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('wallets_his')
          .then(tableDefinition => {
            if (tableDefinition['order_index']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('wallets_his', 'order_index', {
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
        queryInterface.removeColumn('wallets_his', 'order_index', { transaction: t }),
      ]);
    });
  }
};
