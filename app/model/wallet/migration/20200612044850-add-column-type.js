'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('settings')
          .then(async (tableDefinition) => {
            if (tableDefinition['type']) {
              return Promise.resolve();
            }

            return queryInterface.addColumn('settings', 'type', {
              type: Sequelize.DataTypes.STRING(50),
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
        queryInterface.removeColumn('settings', 'type', { transaction: t }),
      ]);
    });
  }
};
