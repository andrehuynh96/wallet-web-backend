'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('claim_requests')
          .then(tableDefinition => {
            if (tableDefinition['affiliate_latest_id']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('claim_requests', 'affiliate_latest_id', {
              type: Sequelize.DataTypes.INTEGER,
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
