'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('claim_requests')
          .then(async (tableDefinition) => {
            if (tableDefinition['system_type']) {
              return Promise.resolve();
            }

            return queryInterface.addColumn('claim_requests', 'system_type', {
              type: Sequelize.DataTypes.STRING(125),
              allowNull: true
            });
          })
      ]);
    });
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('claim_requests', 'system_type', { transaction: t }),
      ]);
    });
  }
};
