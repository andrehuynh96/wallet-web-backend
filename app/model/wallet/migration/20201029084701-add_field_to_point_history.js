'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('point_histories')
          .then(tableDefinition => {
            if (tableDefinition['object_id']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('point_histories', 'object_id', {
              type: Sequelize.DataTypes.STRING(256),
              allowNull: true
            })
          }),
        queryInterface.describeTable('point_histories')
          .then(tableDefinition => {
            if (tableDefinition['platform']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('point_histories', 'platform', {
              type: Sequelize.DataTypes.STRING(32),
              allowNull: true
            })
          }),
        queryInterface.describeTable('point_histories')
          .then(tableDefinition => {
            if (tableDefinition['source_amount']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('point_histories', 'source_amount', {
              type: Sequelize.DataTypes.DECIMAL,
              allowNull: true,
              defaultValue: 0
            })
          })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('point_histories', 'object_id', { transaction: t }),
        queryInterface.removeColumn('point_histories', 'platform', { transaction: t }),
        queryInterface.removeColumn('point_histories', 'source_amount', { transaction: t }),
      ]);
    });
  }
};
