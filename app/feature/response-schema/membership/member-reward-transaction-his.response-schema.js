const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].commission_method': '[].commission_method',
    '[].commission_from': '[].commission_from',
    '[].currency_symbol': '[].currency_symbol',
    '[].amount': '[].amount',
    '[].action': '[].action',
    '[].tx_id': '[].tx_id',
    '[].note': '[].note',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at',
    '[].payout_transferred': '[].payout_transferred',
  },
  single: {
    id: 'id',
    commission_method: 'commission_method',
    commission_from: 'commission_from',
    currency_symbol: 'currency_symbol',
    amount: 'amount',
    action: 'action',
    tx_id: 'tx_id',
    note: 'note',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    payout_transferred: 'payout_transferred',
  }
};
module.exports = srcObject => {
  if (Array.isArray(srcObject)) {
    if (srcObject === undefined || srcObject.length == 0) {
      return srcObject;
    } else {
      return objectMapper(srcObject, destObject.array);
    }
  }
  else {
    return objectMapper(srcObject, destObject.single);
  }
};
