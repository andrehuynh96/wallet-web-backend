'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('member_kyc_properties')
          .then(tableDefinition => {
            if (tableDefinition['note']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('member_kyc_properties', 'note', {
              type: Sequelize.DataTypes.TEXT('medium'),
              allowNull: true,
            })
          })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('member_kyc_properties', 'note', { transaction: t }),
      ]);
    });
  }
};
