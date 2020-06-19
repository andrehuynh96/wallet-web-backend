'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('settings')
          .then(async (tableDefinition) => {
            if (tableDefinition['property']) {
              return Promise.resolve();
            }

            return queryInterface.addColumn('settings', 'property', {
              type: Sequelize.DataTypes.STRING(100),
              allowNull: true,
            });
          })
      ]);
    });
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('settings', 'property', { transaction: t }),
      ]);
    });
  }
};
