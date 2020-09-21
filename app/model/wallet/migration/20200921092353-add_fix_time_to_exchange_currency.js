'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('exchange_currencies')
          .then(tableDefinition => {
            if (tableDefinition['fixed_time']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('exchange_currencies', 'fixed_time', {
              type: Sequelize.DataTypes.INTEGER,
              allowNull: true,
              defaultValue: 0
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
