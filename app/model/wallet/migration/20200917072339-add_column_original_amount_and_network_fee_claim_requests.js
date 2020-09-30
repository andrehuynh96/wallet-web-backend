'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('claim_requests')
          .then(tableDefinition => {
            if (tableDefinition['original_amount']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('claim_requests', 'original_amount', {
              type: Sequelize.DataTypes.DECIMAL,
              allowNull: true,
            });
          }),
        queryInterface.describeTable('claim_requests')
          .then(tableDefinition => {
            if (tableDefinition['network_fee']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('claim_requests', 'network_fee', {
              type: Sequelize.DataTypes.DECIMAL,
              allowNull: true,
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
