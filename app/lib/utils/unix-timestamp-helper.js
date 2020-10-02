const moment = require('moment');
module.exports = {
  getDateRangeUnitTimeStamp: (dateType,dateNum) => {
    const today = new Date();
    let fromDate = 0;
    const toDate = moment(today).valueOf();
    switch (dateType) {
      case 'MINUTE': {
        fromDate = moment(today).subtract(dateNum, 'minute').valueOf();
        break;
      }
      case 'HOUR': {
        fromDate = moment(today).subtract(dateNum, 'hour').valueOf();
        break;
      }
      case 'DAY': {
        fromDate = moment(today).subtract(24*dateNum, 'hour').valueOf();
        break;
      }
      case 'WEEK': {
        fromDate = moment(today).subtract(7*dateNum, 'day').valueOf();
        break;
      }
      case 'MONTH': {
        fromDate = moment(today).subtract(dateNum, 'month').valueOf();
        break;
      }
      case 'YEAR': {
        fromDate = moment(today).subtract(dateNum, 'year').valueOf();
        break;
      }
      default: {
        fromDate = moment(today).subtract(24*dateNum, 'hour').valueOf();
        break;
      }
    }
    const from = Math.floor(fromDate / 1000); // second
    const to = Math.floor(toDate / 1000);
    return {
      from: from,
      to: to
    }
  }
};
