const Model = require('app/model/wallet').membership_types;
const MembershipTypeName = require('app/model/wallet/value-object/membership-type-name');

(async () => {
  const count = await Model.count();

  if (count === 0) {
    await Model.bulkCreate([
      {
        name: 'Free',
        price: 0,
        currency_symbol: 'USD',
        type: MembershipTypeName.Free,
        display_order: null,
      },
      {
        name: 'Paid',
        price: 100,
        currency_symbol: 'USD',
        type: MembershipTypeName.Paid,
        display_order: 1,
      },
    ], {
      returning: true
    });
  }
})();
