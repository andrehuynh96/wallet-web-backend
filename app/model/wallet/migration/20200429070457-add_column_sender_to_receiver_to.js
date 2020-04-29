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
        queryInterface.addColumn('member_transaction_his', 'sender_to', {
          type: Sequelize.DataTypes.STRING(128),
          allowNull: true
        }, { transaction: t }),
        queryInterface.addColumn('member_transaction_his', 'receiver_to', {
          type: Sequelize.DataTypes.STRING(128),
          allowNull: true
        }, { transaction: t })
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
