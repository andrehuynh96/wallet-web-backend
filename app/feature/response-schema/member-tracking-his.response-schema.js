const objectMapper = require('object-mapper');

const destObject = {
    array: {
        '[].tx_id': '[].tx_id',
        '[].platform': '[].platform',
        '[].symbol': '[].symbol',
        '[].amount': '[].amount',
        '[].action': '[].action',
        '[].memo': '[].memo'
    },
    single: {
        tx_id: 'tx_id',
        platform: 'platform',
        symbol: 'symbol',
        amount: 'amount',
        action: 'action',
        memo: 'memo'
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