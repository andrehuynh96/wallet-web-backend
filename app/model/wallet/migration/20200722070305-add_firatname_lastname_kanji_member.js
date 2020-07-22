'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('members')
          .then(tableDefinition => {
            if (tableDefinition['first_name_kanji']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('members', 'first_name_kanji', {
              type: Sequelize.DataTypes.STRING(128),
              allowNull: true
            })
          }),
        queryInterface.describeTable('members')
          .then(tableDefinition => {
            if (tableDefinition['last_name_kanji']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('members', 'last_name_kanji', {
              type: Sequelize.DataTypes.STRING(128),
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
