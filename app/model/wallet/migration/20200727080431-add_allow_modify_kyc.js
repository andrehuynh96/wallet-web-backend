'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('kycs')
          .then(tableDefinition => {
            if (tableDefinition['allow_modify']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('kycs', 'allow_modify', {
              type: Sequelize.DataTypes.BOOLEAN,
              allowNull: false,
              defaultValue: false
            })
          })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('kycs', 'allow_modify', { transaction: t }),
      ]);
    });
  }
};
