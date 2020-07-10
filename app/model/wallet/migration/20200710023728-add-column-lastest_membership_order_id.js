'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('members')
          .then(async (tableDefinition) => {
            if (tableDefinition['lastest_membership_order_id']) {
              return Promise.resolve();
            }

            return queryInterface.addColumn('members', 'lastest_membership_order_id', {
              type: Sequelize.DataTypes.INTEGER,
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
        queryInterface.removeColumn('members', 'lastest_membership_order_id', { transaction: t }),
      ]);
    });
  }
};
