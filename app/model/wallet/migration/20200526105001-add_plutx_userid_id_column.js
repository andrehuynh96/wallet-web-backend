'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('members')
          .then(tableDefinition => {
            if (tableDefinition['plutx_userid_id']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('members', 'plutx_userid_id', {
              type: Sequelize.DataTypes.UUID,
              allowNull: true,
            })
          })
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
