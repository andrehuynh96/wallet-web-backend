'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('members', 'plutx_userid_id', {
          type: Sequelize.DataTypes.UUID,
          // type: Sequelize.DataTypes.STRING(12),
          allowNull: true,
        }, { transaction: t }),
      ]);
    });
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('members', 'plutx_userid_id', { transaction: t }),
      ]);
    });
  }
};
