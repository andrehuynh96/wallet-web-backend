'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('members')
          .then(tableDefinition => {
            if (tableDefinition['term_condition_date']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('members', 'term_condition_date', {
              type: Sequelize.DataTypes.DATE,
              allowNull: true
            })
          }),
        queryInterface.describeTable('members')
          .then(tableDefinition => {
            if (tableDefinition['term_condition_id']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('members', 'term_condition_id', {
              type: Sequelize.DataTypes.INTEGER,
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
        queryInterface.removeColumn('members', 'term_condition_date', { transaction: t }),
        queryInterface.removeColumn('members', 'term_condition_id', { transaction: t }),
      ]);
    });
  }
};
