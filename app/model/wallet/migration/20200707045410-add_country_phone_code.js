'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('members')
          .then(async (tableDefinition) => {
            if (tableDefinition['country_phone_code']) {
              return Promise.resolve();
            }

            return queryInterface.addColumn('members', 'country_phone_code', {
              type: Sequelize.DataTypes.STRING(64),
              allowNull: true
            });
          })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('members', 'country_phone_code', { transaction: t }),
      ]);
    });
  }
};
