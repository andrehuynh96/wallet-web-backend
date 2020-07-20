'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('members')
          .then(async (tableDefinition) => {
            if (tableDefinition['membership_type_id']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('members', 'membership_type_id', {
              type: Sequelize.DataTypes.UUID,
              allowNull: true,
            });

            const sql = `UPDATE public.members SET membership_type_id=(select id from public.membership_types mt where mt."type"='Free') where membership_type_id is null;`;
            await queryInterface.sequelize.query(sql, {}, {});

            return Promise.resolve();
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
