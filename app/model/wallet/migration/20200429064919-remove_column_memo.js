'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('member_transaction_his')
          .then(tableDefinition => {
            if (!tableDefinition['memo']) {
              return Promise.resolve();
            }
            return queryInterface.removeColumn('member_transaction_his', 'memo')
          })
        ,
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
