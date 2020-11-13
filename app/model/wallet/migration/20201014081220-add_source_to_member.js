'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('members')
          .then(tableDefinition => {
            if (tableDefinition['source']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('members', 'source', {
              type: Sequelize.DataTypes.STRING(64),
              allowNull: true,
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
