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
            if (tableDefinition['from_address']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('member_transaction_his', 'from_address', {
              type: Sequelize.DataTypes.STRING(128),
              allowNull: true
            });
          }),
        queryInterface.describeTable('member_transaction_his')
          .then(tableDefinition => {
            if (tableDefinition['to_address']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('member_transaction_his', 'to_address', {
              type: Sequelize.DataTypes.STRING(128),
              allowNull: true
            });
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
