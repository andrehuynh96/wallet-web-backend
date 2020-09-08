const objectMapper = require('object-mapper');

const destObject = {
  array: {
    "[].id": "[].id",
    "[].provider": "[].provider",
    "[].member_id": "[].member_id",
    "[].from_currency": "[].from_currency",
    "[].to_currency": "[].to_currency",
    "[].request_recipient_address": "[].request_recipient_address",
    "[].request_amount": "[].request_amount",
    "[].request_extra_id": "[].request_extra_id",
    "[].request_refund_address": "[].request_refund_address",
    "[].request_refund_extra_id": "[].request_refund_extra_id",
    "[].rate_id": "r[].ate_id",
    "[].transaction_id": "[].transaction_id",
    "[].transaction_date": "[].transaction_date",
    "[].provider_fee": "[].provider_fee",
    "[].api_extra_fee": "[].api_extra_fee",
    "[].payin_extra_id": "[].payin_extra_id",
    "[].payout_extra_id": "[].payout_extra_id",
    "[].status": "[].status",
    "[].amount_expected_from": "[].amount_expected_from",
    "[].amount_expected_to": "[].amount_expected_to",
    "[].amount_to": "[].amount_to",
    "[].payin_address": "[].payin_address",
    "[].payout_address": "[].payout_address",
    "[].createdAt": "[].created_at"
  },
  single: {
    "id": "id",
    "provider": "provider",
    "member_id": "member_id",
    "from_currency": "from_currency",
    "to_currency": "to_currency",
    "request_recipient_address": "request_recipient_address",
    "request_amount": "request_amount",
    "request_extra_id": "request_extra_id",
    "request_refund_address": "request_refund_address",
    "request_refund_extra_id": "request_refund_extra_id",
    "rate_id": "rate_id",
    "transaction_id": "transaction_id",
    "transaction_date": "transaction_date",
    "provider_fee": "provider_fee",
    "api_extra_fee": "api_extra_fee",
    "payin_extra_id": "payin_extra_id",
    "payout_extra_id": "payout_extra_id",
    "status": "status",
    "amount_expected_from": "amount_expected_from",
    "amount_expected_to": "amount_expected_to",
    "amount_to": "amount_to",
    "payin_address": "payin_address",
    "payout_address": "payout_address",
    "createdAt": "created_at"
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