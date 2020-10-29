'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('exchange_transactions')
          .then(tableDefinition => {
            if (tableDefinition['estimate_amount_usd']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('exchange_transactions', 'estimate_amount_usd', {
              type: Sequelize.DataTypes.DECIMAL,
              allowNull: true,
              defaultValue: 0
            })
          }),

        queryInterface.describeTable('exchange_transactions_his')
          .then(tableDefinition => {
            if (tableDefinition['estimate_amount_usd']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('exchange_transactions_his', 'estimate_amount_usd', {
              type: Sequelize.DataTypes.DECIMAL,
              allowNull: true,
              defaultValue: 0
            })
          })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('exchange_transactions', 'estimate_amount_usd', { transaction: t }),
        queryInterface.removeColumn('exchange_transactions_his', 'estimate_amount_usd', { transaction: t }),
      ]);
    });
  }
};
