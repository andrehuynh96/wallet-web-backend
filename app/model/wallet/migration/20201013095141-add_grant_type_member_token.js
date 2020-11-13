'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('member_tokens')
          .then(tableDefinition => {
            if (tableDefinition['grant_type']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('member_tokens', 'grant_type', {
              type: Sequelize.DataTypes.STRING(32),
              allowNull: true
            });
          }),

        queryInterface.changeColumn('member_tokens', 'member_id', {
          type: Sequelize.DataTypes.UUID,
          allowNull: true,
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
