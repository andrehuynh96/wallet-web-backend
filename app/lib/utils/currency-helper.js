const BigNumber = require('bignumber.js');

const NUM_OF_DECIMAL_DIGITS = {
    // '$': 2,
    // USD: 2,
    // USDT: 2,
    // JPY: 2,
    BTC: 8,
    BTCSW: 8,
    ONT: 9,
    ONG: 9,
    ATOM: 6,
    IRIS: 18,
    ONE: 18,
    XTZ: 6,
    QTUM: 8,
};
const getFormatDecimalDigits = (value, currencySymbol) => {
    if (value == 0) {
        return 0;
    }

    const numOfDecimalDigits = NUM_OF_DECIMAL_DIGITS[currencySymbol.toUpperCase()] || 0;

    const decimalValue = Math.pow(10, numOfDecimalDigits);

    return parseFloat(new BigNumber(value).multipliedBy(decimalValue));
}
module.exports = {
    getFormatDecimalDigits,
};
