'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('wallet_priv_keys')
          .then(tableDefinition => {
            if (tableDefinition['order_index']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('wallet_priv_keys', 'order_index', {
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
        queryInterface.removeColumn('wallet_priv_keys', 'order_index', { transaction: t }),
      ]);
    });
  }
};

