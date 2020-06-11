'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('members')
          .then(tableDefinition => {
            if (tableDefinition['membership_type_id']) {
              return Promise.resolve();
            }

            return queryInterface.addColumn('members', 'membership_type_id', {
              type: Sequelize.DataTypes.INTEGER,
              allowNull: true,
            }, { transaction: t });
          })
      ]);
    });
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('members', 'membership_type_id', { transaction: t }),
      ]);
    });
  }
};
