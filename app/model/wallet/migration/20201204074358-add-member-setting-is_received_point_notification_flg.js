'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('member_settings')
          .then(tableDefinition => {
            if (tableDefinition['is_received_point_notification_flg']) {
              return Promise.resolve();
            }
            return queryInterface.addColumn('member_settings', 'is_received_point_notification_flg', {
              type: Sequelize.DataTypes.BOOLEAN,
              allowNull: false,
              defaultValue: true
            });
          }),
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
