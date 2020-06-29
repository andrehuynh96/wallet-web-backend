'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('membership_types')
          .then(async (tableDefinition) => {
            if (tableDefinition['is_enabled']) {
              return Promise.resolve();
            }

            return queryInterface.addColumn('membership_types', 'is_enabled', {
              type: Sequelize.DataTypes.BOOLEAN,
              allowNull: true,
              default: false,
            });
          })
      ]);
    });
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('membership_types', 'is_enabled', { transaction: t }),
      ]);
    });
  }
};
