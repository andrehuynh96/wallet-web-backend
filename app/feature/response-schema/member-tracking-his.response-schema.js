const objectMapper = require('object-mapper');

const destObject = {
    array: {
        '[].tx_id': '[].tx_id',
        '[].platform': '[].platform',
        '[].symbol': '[].symbol',
        '[].amount': '[].amount',
        '[].action': '[].action',
        '[].memo': '[].memo',
        '[].staking_platform_id': '[].staking_platform_id',
        '[].plan_id': '[].plan_id',
        '[].duration': '[].duration',
        '[].duration_type': '[].duration_type',
        '[].reward_percentage': '[].reward_percentage',
        '[].validator_fee': '[].validator_fee'
    },
    single: {
        tx_id: 'tx_id',
        platform: 'platform',
        symbol: 'symbol',
        amount: 'amount',
        action: 'action',
        memo: 'memo',
        staking_platform_id: 'staking_platform_id',
        plan_id: 'plan_id',
        duration: 'duration',
        duration_type: 'duration_type',
        reward_percentage: 'reward_percentage',
        validator_fee: 'validator_fee'
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