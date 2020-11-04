const CryptoJS = require('crypto-js');
const axios = require('axios');
// const { toSnakeCase } = require('app/lib/case-style');

WYRE_URL="https://api.testwyre.com"
WYRE_API_KEY="AK-9LEWG2YW-C3DBNWEL-3ANNMRMW-7P6TJ9E7"
WYRE_SECRET_KEY="SK-7CLXUGQD-A9F84VD3-W8BJLJFT-JNM7ABBF"
WYRE_ACCOUNT_ID="AC_DHXCZZNCJ29"

const test = {

}

const estimate = async ({ source_currency, dest_currency, amount, dest_address, country }) => {
  try {
    const timestamp = new Date().getTime();
    const path = `/v3/orders/quote/partner?timestamp=${timestamp}`;
    const params = {
        amount: 1,
        sourceCurrency: "USD",
        destCurrency: "BTC",
        dest: "bitcoin:moTXHK5dfgT62Y8XMM6RxRAVV8ojmofAnR",
        accountId: WYRE_ACCOUNT_ID,
        country: "VN"
    }
    const method = "POST";
    return await _makeRequest({path, method, params})
  }
  catch (err) {
    console.error(`Wyre estimate error:`, err);
    throw err;
  }
}

const makeTransaction = async ({ source_currency, dest_currency, amount, dest_address, payment_method, country, email, phone }) => {
  try {
    const timestamp = new Date().getTime();
    const path = `/v3/orders/reserve?timestamp=${timestamp}`;
    const method = "POST";
    let params = {
      amount: 1,
      sourceCurrency: "usd",
      destCurrency: "btc",
      dest: "bitcoin:moTXHK5dfgT62Y8XMM6RxRAVV8ojmofAnR",
      referrerAccountId: WYRE_ACCOUNT_ID,
      paymentMethod: "apple-pay",
      email: "emailahkhongco@gmail.com",
      phone: "+84834296997"  
    }
    return await _makeRequest({path, method, params})
  }
  catch (err) {
    console.error(`changelly createTransaction error:`, err);
    throw err;
  }
}

const getTransaction = async (transferId) => {
  try {
    const path = `/v2/transfer/${transferId}/track`;
    let response = await axios.get(WYRE_URL + path);
    console.log(response.data)
    return response.data;
  }
  catch (err) {
    console.error(`Wyre get transaction error:`, err);
    throw err;
  }
}

const getOrder = async (orderId) => {
  try {
    const path = `/v3/orders/${orderId}`;
    let response = await axios.get(WYRE_URL + path);
    console.log(response.data)
    return response.data;
  }
  catch (err) {
    console.error(`Wyre get transaction error:`, err);
    throw err;
  }
}

const _makeRequest = async ({ path, method, params }) => {
  const details = JSON.stringify(params);
  const headers = {};
  const url = WYRE_URL + path;
  headers['Content-Type'] = 'application/json';
  headers['X-Api-Key'] = WYRE_API_KEY;
  headers['X-Api-Signature'] = _signature(url, details);
  const config = {
      method: method,
      url: url,
      headers: headers,
      data: details
  }
  const response = await axios(config);
  if (response.data.error) {
    console.error(`Wyre service error:`, response.data.error);
  }
  console.log(response.data)
  return response.data;
}

const _signature = (url, data) => {
  const dataToSign = url + data;
  const token = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(dataToSign.toString(CryptoJS.enc.Utf8), WYRE_SECRET_KEY));
  return token;
}

// estimate({})
// makeTransaction({})
getTransaction('TF_BLZUJL34CM7');
// getOrder('WO_UAL7VU77ZD');

