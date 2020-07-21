'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('members')
          .then(tableDefinition => {
            if (tableDefinition['current_language']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('members', 'current_language', {
              type: Sequelize.DataTypes.STRING(100),
              allowNull: true
            })
          })
      ]);
    });
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('members', 'current_language', { transaction: t }),
      ]);
    });
  }
};
