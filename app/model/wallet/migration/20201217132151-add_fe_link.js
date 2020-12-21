'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('fiat_transactions')
          .then(tableDefinition => {
            if (tableDefinition['fe_redirect_url']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('fiat_transactions', 'fe_redirect_url', {
              type: Sequelize.DataTypes.TEXT('medium'),
              allowNull: true
            })
          }),
        queryInterface.describeTable('fiat_transactions')
          .then(tableDefinition => {
            if (tableDefinition['fe_failure_redirect_url']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('fiat_transactions', 'fe_failure_redirect_url', {
              type: Sequelize.DataTypes.TEXT('medium'),
              allowNull: true
            })
          })
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
