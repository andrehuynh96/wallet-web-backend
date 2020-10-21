const logger = require('app/lib/logger');
const Sequelize = require('sequelize');
const db = require("app/model/wallet");
const moment = require('moment');
const Joi = require('joi');
const BigNumber = require('bignumber.js');
const { assetListSchema, historySchema } = require('./validator');

module.exports = {
  getAssetList: async (req, res, next) => {
    try {
      const validate = Joi.validate(req.query, assetListSchema);
      if (validate.error) {
        console.log(validate.error);
        return res.badRequest("Missing parameters", validate.error);
      }

      let { type, platform, wallet_id, sort } = req.query;
      type = type ? type.trim().toUpperCase() : 'ALL';
      platform = platform ? platform.trim().toUpperCase() : 'ALL';
      wallet_id = wallet_id ? wallet_id : '';
      sort = sort && 'asc' === sort.trim() ? 'ASC' : 'DESC';
      let { from, to } = _getDateRangeUnitTimeStamp(type.toUpperCase(), 1);

      if ('ALL' === type) {
        const getTimeResults = await db.sequelize.query(
          `SELECT MAX(created_at), MIN(created_at) FROM member_assets;`,
          { type: db.sequelize.QueryTypes.SELECT }
        );

        if (getTimeResults && getTimeResults.length > 0) {
          if (null != getTimeResults[0].min) {
            from = Math.floor(getTimeResults[0].min.getTime() / 1000);
          }

          if (null != getTimeResults[0].max) {
            to = Math.floor(getTimeResults[0].max.getTime() / 1000);
          }
        }
      }

      let where = {
        memberId: req.user.id,
        platform,
        wallet_id,
        to,
        from,
      }

      const timeFilter = _getDateFilter(type.toUpperCase(), "created_at");

      let sqlItems = `SELECT 
                        SUM(reward) AS reward, 
                        SUM(amount) AS staked, 
                        platform AS currency,
                        COUNT(platform) AS number_row,
                        ${timeFilter} AS ct 
                        FROM member_assets 
                        WHERE member_assets.address IN (
                            SELECT wpk.address 
                            FROM 
                                wallets AS w
                            RIGHT JOIN 
                                wallet_priv_keys AS wpk 
                                ON w.id = wpk.wallet_id 
                            WHERE 
                                w.member_id = :memberId
                                ${wallet_id ? ' AND w.id = :wallet_id' : ''}
                        )  
                        ${'ALL' !== type ? ' AND created_at >= TO_TIMESTAMP(:from) AND created_at <= TO_TIMESTAMP(:to)' : ''} 
                        ${'ALL' !== platform ? ' AND platform = :platform ' : ''}
                        GROUP BY ct, currency ORDER BY ct ${sort}`;

      const itemResults = await db.sequelize.query(sqlItems, {
        replacements: where,
        type: db.sequelize.QueryTypes.SELECT
      });

      let items = {};
      for (let i = 0; i < itemResults.length; i++) {
        if (!items[itemResults[i].currency]) {
          items[itemResults[i].currency] = [];
        }

        items[itemResults[i].currency].push({
          reward: parseFloat((new BigNumber(itemResults[i].reward))),
          staked: parseFloat((new BigNumber(itemResults[i].staked)).div(parseFloat(itemResults[i].number_row))),
          date: itemResults[i].ct
        });
      }

      return res.ok({
        items,
        begin_date: from,
        end_date: to,
        type
      });
    }
    catch (err) {
      logger.error('get asset list fail:', err);
      next(err);
    }
  },
  getAssetHistory: async (req, res, next) => {
    try {

      const validate = Joi.validate(req.query, historySchema);
      if (validate.error) {
        console.log(validate.error);
        return res.badRequest("Missing parameters", validate.error);
      }

      const today = new Date(new Date().toUTCString());
      today.setDate(today.getDate() - 1);
      let toDate = moment(today);
      toDate.utcOffset(0);
      toDate.set({ hour: 23, minute: 59, second: 59 });
      const to = Math.floor(toDate.valueOf() / 1000);

      let { platform, wallet_id, sort, offset, limit } = req.query;
      platform = platform ? platform.toUpperCase() : '';
      offset = offset ? offset : 0;
      limit = limit ? limit : 25;
      wallet_id = wallet_id ? wallet_id : '';
      sort = sort && 'asc' === sort.trim() ? 'ASC' : 'DESC';

      let where = {
        memberId: req.user.id,
        platform,
        wallet_id,
        offset,
        limit,
        to
      }

      let sqlTotal = `                       
                        SELECT 
                        COUNT(id) AS total
                        FROM member_assets 
                        WHERE member_assets.address IN (
                            SELECT wpk.address 
                            FROM 
                                wallets AS w
                            RIGHT JOIN 
                                wallet_priv_keys AS wpk 
                                ON w.id = wpk.wallet_id 
                            WHERE 
                                w.member_id = :memberId ${wallet_id ? ' AND w.id = :wallet_id' : ''} 
                        ) 
                        ${'' !== platform ? ' AND platform = :platform' : ''} AND created_at <= TO_TIMESTAMP(:to)`;
      // 

      const totalResults = await db.sequelize.query(sqlTotal, {
        replacements: where,
        type: db.sequelize.QueryTypes.SELECT
      });

      const total = parseInt(totalResults[0].total);

      let sqlItems = `SELECT 
                        platform AS currency, 
                        reward, 
                        amount AS staked, 
                        created_at,
                        updated_at
                        FROM member_assets 
                        WHERE member_assets.address IN (
                            SELECT wpk.address 
                            FROM 
                                wallets AS w
                            RIGHT JOIN 
                                wallet_priv_keys AS wpk 
                                ON w.id = wpk.wallet_id 
                            WHERE 
                                w.member_id = :memberId ${wallet_id ? ' AND w.id = :wallet_id' : ''}
                        ) 
                        ${'' !== platform ? ' AND platform = :platform' : ''} AND created_at <= TO_TIMESTAMP(:to) 
                        ORDER BY created_at ${sort} LIMIT :limit OFFSET :offset`;

      const itemResults = await db.sequelize.query(sqlItems, {
        replacements: where,
        type: db.sequelize.QueryTypes.SELECT
      });

      let items = itemResults.map(item => {
        return {
          symbol: item.currency,
          reward: parseFloat((new BigNumber(item.reward))),
          staked: parseFloat((new BigNumber(item.staked))),
          create_at: item.created_at
        };
      });

      return res.ok({
        items: items,
        offset: offset,
        limit: limit,
        total: total
      });
    }
    catch (err) {
      logger.error('get asset history fail:', err);
      next(err);
    }
  }
};

function _getDateRangeUnitTimeStamp(dateType, dateNum) {
  const today = new Date(new Date().toUTCString());
  today.setDate(today.getDate() - 1);
  let fromDate = 0;
  let toDate = moment(today);

  switch (dateType) {
    case 'DAY':
      fromDate = moment(today).subtract(dateNum, 'day').add(1, 'day');
      break;
    case 'WEEK':
      fromDate = moment(today).subtract(6 * dateNum, 'day');
      break;

    case 'MONTH':
      fromDate = moment(today).add(1, 'day').subtract(dateNum, 'month');
      break;

    case 'YEAR':
      fromDate = moment(today).add(1, 'day').subtract(dateNum, 'year');
      break;

    default:
      fromDate = moment(today).subtract(24 * dateNum, 'hour');
      break;

  }

  switch (dateType) {
    case 'DAY':
    case 'WEEK':
    case 'MONTH':
    case 'YEAR':
      toDate.utcOffset(0);
      fromDate.utcOffset(0);
      toDate.set({ hour: 23, minute: 59, second: 59 });
      fromDate.set({ hour: 0, minute: 0, second: 0 });
      break;
  }

  const from = Math.floor(fromDate.valueOf() / 1000); // second
  const to = Math.floor(toDate.valueOf() / 1000);
  return { from, to }
}

function _getDateFilter(dateType, columnName) {

  let query = columnName;
  switch (dateType) {
    case 'DAY':
      query = `CONCAT(
            DATE_PART('YEAR', ${columnName}),
            '-',
            DATE_PART('MONTH', ${columnName}), 
            '-',
            DATE_PART('DAY', ${columnName}), 
            ' ',
            DATE_PART('HOUR', ${columnName}),
            ':00')`;
      break;

    case 'WEEK':
    case 'MONTH':
      query = `CONCAT(
                DATE_PART('YEAR', ${columnName}),
                '-',
                DATE_PART('MONTH', ${columnName}), 
                '-',
                DATE_PART('DAY', ${columnName}))`;
      break;

    case 'YEAR':
      query = `CONCAT(
                DATE_PART('YEAR', ${columnName}),
                '-',
                DATE_PART('MONTH', ${columnName}))`;
      break;

    case 'ALL':
      query = `DATE_PART('YEAR', ${columnName})`;
      break;

    default:
      break;
  }

  return query;
}
