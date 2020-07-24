'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.changeColumn('member_transaction_his', 'sender_note', {
          type: Sequelize.DataTypes.STRING(1024),
          allowNull: true
        }, { transaction: t }),
        queryInterface.changeColumn('member_transaction_his', 'receiver_note', {
          type: Sequelize.DataTypes.STRING(1024),
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
