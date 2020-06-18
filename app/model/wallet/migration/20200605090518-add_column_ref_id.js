'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('wallet_tokens')
          .then(tableDefinition => {
            if (tableDefinition['ref_id']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('wallet_tokens', 'ref_id', {
              type: Sequelize.DataTypes.STRING(128)
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
