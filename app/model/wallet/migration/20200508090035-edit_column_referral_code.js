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
        queryInterface.changeColumn('members', 'referral_code', {
          type: Sequelize.DataTypes.STRING(12),
          allowNull: true,
          defaultValue: 0
        }, { transaction: t }),
        queryInterface.changeColumn('members', 'referrer_code', {
          type: Sequelize.DataTypes.STRING(12),
          allowNull: true,
          defaultValue: 0
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
