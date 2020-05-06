const objectMapper = require('object-mapper');

const destObject = {
    array: {
        '[].tx_id': '[].tx_id',
        '[].platform': '[].platform',
        '[].symbol': '[].symbol',
        '[].amount': '[].amount',
        '[].action': '[].action',
        '[].staking_platform_id': '[].staking_platform_id',
        '[].plan_id': '[].plan_id',
        '[].duration': '[].duration',
        '[].duration_type': '[].duration_type',
        '[].sender_note': '[].sender_note',
        '[].receiver_note': '[].receiver_note',
        '[].from_address': '[].from_address',
        '[].to_address': '[].to_address',
        '[].sender_to': '[].sender_to',
        '[].receiver_to': '[].receiver_to',
        '[].reward_percentage': '[].reward_percentage',
        '[].validator_fee': '[].validator_fee',
        '[].domain_name': '[].domain_name',
        '[].member_domain_name': '[].member_domain_name'
    },
    single: {
        tx_id: 'tx_id',
        platform: 'platform',
        symbol: 'symbol',
        amount: 'amount',
        action: 'action',
        staking_platform_id: 'staking_platform_id',
        plan_id: 'plan_id',
        duration: 'duration',
        duration_type: 'duration_type',
        sender_note: 'sender_note',
        receiver_note: 'receiver_note',
        from_address: 'from_address',
        to_address: 'to_address',
        sender_to: 'sender_to',
        receiver_to: 'receiver_to',
        reward_percentage: 'reward_percentage',
        validator_fee: 'validator_fee',
        domain_name: 'domain_name',
        member_domain_name: 'member_domain_name'
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