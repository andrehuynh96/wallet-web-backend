const objectMapper = require('object-mapper');

const destObject = {
    array: {
        "[].id": "[].id",
        "[].from_currency": "[].from_currency",
        "[].to_cryptocurrency": "[].to_cryptocurrency",
        "[].payment_method": "[].payment_method",
        "[].payment_method_name": "[].payment_method_name",
        "[].from_amount": "[].from_amount",
        "[].to_amount": "[].to_amount",
        "[].to_address": "[].to_address",
        "[].payment_url": "[].payment_url",
        "[].reservation": "[].reservation",
        "[].redirect_url": "[].redirect_url",
        "[].failure_redirect_url": "[].failure_redirect_url",
        "[].rate": "[].rate",
        "[].fee_currency": "[].fee_currency",
        "[].total_fee": "[].total_fee",
        "[].fee_from": "[].fee_from",
        "[].fee_to": "[].fee_to",
        "[].fees": "[].fees",
        "[].order_id": "[].order_id",
        "[].order_type": "[].order_type",
        "[].transaction_id": "[].transaction_id",
        "[].tx_id": "[].tx_id",
        "[].transaction_status": "[].transaction_status",
        "[].status": "[].status",
        "[].provider": "[].provider",
        "[].message": "[].message",
        "[].response": "[].response",
        "[].device_code": "[].device_code",
        "[].createdAt": "[].createdAt",
        "[].updatedAt": "[].updatedAt"
    },
    single: {
        "id": "id",
        "from_currency": "from_currency",
        "to_cryptocurrency": "to_cryptocurrency",
        "payment_method": "payment_method",
        "payment_method_name": "payment_method_name",
        "from_amount": "from_amount",
        "to_amount": "to_amount",
        "to_address": "to_address",
        "payment_url": "payment_url",
        "reservation": "reservation",
        "redirect_url": "redirect_url",
        "failure_redirect_url": "failure_redirect_url",
        "rate": "rate",
        "fee_currency": "fee_currency",
        "total_fee": "total_fee",
        "fee_from": "fee_from",
        "fee_to": "fee_to",
        "fees": "fees",
        "order_id": "order_id",
        "order_type": "order_type",
        "transaction_id": "transaction_id",
        "tx_id": "tx_id",
        "transaction_status": "transaction_status",
        "status": "status",
        "provider": "provider",
        "message": "message",
        "response": "response",
        "device_code": "device_code",
        "createdAt": "createdAt",
        "updatedAt": "updatedAt"
    }
};
module.exports = srcObject => {
    if (Array.isArray(srcObject)) {
        if (srcObject === undefined || srcObject.length == 0) {
            return srcObject;
        }
        else {
            return objectMapper(srcObject, destObject.array)
        }
    }
    else {
        return objectMapper(srcObject, destObject.single)
    }
};