const Model = require('app/model/wallet').membership_types;
const MembershipTypeName = require('app/model/wallet/value-object/membership-type-name');

module.exports = async () => {
  const count = await Model.count();

  if (count === 0) {
    await Model.bulkCreate([
      {
        name: 'Silver',
        price: 0,
        currency_symbol: 'USD',
        type: MembershipTypeName.Free,
        display_order: 1,
        deleted_flg: false,
        is_enabled: true,
        key: 'SILVER'
      },
      {
        name: 'Gold',
        price: 100,
        currency_symbol: 'USD',
        type: MembershipTypeName.Paid,
        display_order: 2,
        deleted_flg: false,
        is_enabled: true,
        key: 'GOLD'
      },
      {
        name: 'Platinum',
        price: 1000,
        currency_symbol: 'USD',
        type: MembershipTypeName.Paid,
        display_order: 4,
        deleted_flg: false,
        is_enabled: false,
        key: 'PLATINUM'
      },
      {
        name: 'Diamond',
        price: 5000,
        currency_symbol: 'USD',
        type: MembershipTypeName.Paid,
        display_order: 5,
        deleted_flg: false,
        is_enabled: false,
        key: 'DIAMOND'
      },
    ], {
      returning: true
    });
  }
};
