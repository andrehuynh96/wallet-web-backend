'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('exchange_transactions')
          .then(tableDefinition => {
            if (tableDefinition['device_code']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('exchange_transactions', 'device_code', {
              type: Sequelize.DataTypes.STRING(256),
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
