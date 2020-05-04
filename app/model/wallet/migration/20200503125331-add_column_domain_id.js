'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('members', 'domain_id', {
          type: Sequelize.DataTypes.INTEGER,
          autoIncrement: true
        }, { transaction: t }),
        queryInterface.addColumn('members', 'domain_name', {
          type: Sequelize.DataTypes.STRING(256)
        }, { transaction: t })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('members', 'domain_id', { transaction: t }),
        queryInterface.removeColumn('members', 'domain_name', { transaction: t })
      ]);
    });
  }
};
