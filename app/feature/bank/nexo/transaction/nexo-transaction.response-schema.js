const objectMapper = require('object-mapper');
const destObject = {
  array: {
    "[].id": "[].id",
    "[].wallet_id": "[].wallet_id",
    "[].nexo_member_id": "[].nexo_member_id",
    "[].nexo_id": "[].nexo_id",
    "[].type": "[].type",
    "[].platform": "[].platform",
    "[].nexo_currency_id": "[].nexo_currency_id",
    "[].amount": "[].amount",
    "[].total_fee": "[].total_fee",
    "[].address": "[].address",
    "[].memo": "[].memo",
    "[].short_name": "[].short_name",
    "[].tx_id": "[].tx_id",
    "[].status": "[].status",
    "[].response": "[].response",
    "[].nexo_transaction_id": "[].nexo_transaction_id",
    "[].device_code": "[].device_code",
    "[].createdAt": "[].created_at",
    "[].updatedAt": "[].updated_at"
  },
  single: {
    "id": "id",
    "wallet_id": "wallet_id",
    "nexo_member_id": "nexo_member_id",
    "nexo_id": "nexo_id",
    "type": "type",
    "platform": "platform",
    "nexo_currency_id": "nexo_currency_id",
    "amount": "amount",
    "total_fee": "total_fee",
    "address": "address",
    "memo": "memo",
    "short_name": "short_name",
    "tx_id": "tx_id",
    "status": "status",
    "response": "response",
    "device_code": "device_code",
    "nexo_transaction_id": "nexo_transaction_id",
    "createdAt": "created_at",
    "updatedAt": "updated_at"
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