const logger = require('app/lib/logger');
const Sequelize = require('sequelize');
const db = require("app/model/wallet");
const moment = require('moment');
const BigNumber = require('bignumber.js');

module.exports = {
    getTotalAssetList: async (req, res, next) => {
        try {
            let filter = req.body.filter && 'all' !== req.body.filter.trim().toLowerCase()
                ? req.body.filter.trim().toUpperCase() : '';
            let platform = req.body.platform && 'all' !== req.body.platform.trim().toLowerCase()
                ? req.body.platform.trim().toUpperCase() : '';
            let offset = req.body.offset ? req.body.offset : 0;
            let limit = req.body.limit ? req.body.limit : 25;
            let { from, to } = _getDateRangeUnitTimeStamp(filter.toUpperCase(), 1);

            let where = {
                memberId: req.user.id,
                platform,
                filter,
                to,
                from,
                offset,
                limit
            }

            const timeFilter = _getDateFilter(filter.toUpperCase(), "created_at");

            let sqlTotal = `
                        SELECT COUNT(T.*) AS total 
                        FROM
                        (SELECT 
                        ${timeFilter} AS ct,
                        platform AS currency 
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
                        )   
                        ${'' !== filter ? ' AND created_at >= TO_TIMESTAMP(:from) AND created_at <= TO_TIMESTAMP(:to)' : ''} 
                        ${'' !== platform ? ' AND platform = :platform ' : ''}
                        GROUP BY ct, currency) AS T`;

            const totalResults = await db.sequelize.query(sqlTotal, {
                replacements: where,
                type: db.sequelize.QueryTypes.SELECT
            });
            const total = parseInt(totalResults[0].total);

            let sqlItems = `SELECT 
                        SUM(Reward) AS reward, 
                        SUM(Amount) AS staked, 
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
                        )  
                        ${'' !== filter ? ' AND created_at >= TO_TIMESTAMP(:from) AND created_at <= TO_TIMESTAMP(:to)' : ''} 
                        ${'' !== platform ? ' AND platform = :platform ' : ''}
                        GROUP BY ct, currency LIMIT :limit OFFSET :offset`;

            const itemResults = await db.sequelize.query(sqlItems, {
                replacements: where,
                type: db.sequelize.QueryTypes.SELECT
            });

            let items = itemResults.map(item => {
                return {
                    symbol: item.currency,
                    reward: (new BigNumber(item.reward)),
                    staked: parseFloat((new BigNumber(item.staked)).div(parseFloat(item.number_row))),
                    sort: item.ct
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
            logger.error('get asset list fail:', err);
            next(err);
        }
    },

    getAssetList: async (req, res, next) => {
        try {
            let filter = req.body.filter && 'all' !== req.body.filter.trim().toLowerCase()
                ? req.body.filter.trim().toUpperCase() : '';
            let platform = req.body.platform && 'all' !== req.body.platform.trim().toLowerCase()
                ? req.body.platform.trim().toUpperCase() : '';
            let offset = req.body.offset ? req.body.offset : 0;
            let limit = req.body.limit ? req.body.limit : 25;
            let { from, to } = _getDateRangeUnitTimeStamp(filter.toUpperCase(), 1);

            let where = {
                memberId: req.user.id,
                platform,
                to,
                from,
                offset,
                limit
            }

            let sqlTotal = `
                        SELECT COUNT(T.Currency) AS Total 
                        FROM
                        (SELECT 
                        platform AS currency 
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
                        )  
                        ${'' !== filter ? ' AND created_at >= TO_TIMESTAMP(:from) AND created_at <= TO_TIMESTAMP(:to)' : ''} 
                        ${'' !== platform ? ' AND platform = :platform ' : ''}
                        GROUP BY platform) AS T`;

            const totalResults = await db.sequelize.query(sqlTotal, {
                replacements: where,
                type: db.sequelize.QueryTypes.SELECT
            });

            const total = parseInt(totalResults[0].total);

            let sqlItems = `SELECT 
                        platform AS currency, 
                        SUM(Reward) AS Reward, 
                        SUM(Amount) AS Staked, 
                        COUNT(platform) AS number_row 
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
                        )   
                        ${'' !== filter ? ' AND created_at >= TO_TIMESTAMP(:from) AND created_at <= TO_TIMESTAMP(:to)' : ''} 
                        ${'' !== platform ? ' AND platform = :platform ' : ''}
                        GROUP BY platform LIMIT :limit OFFSET :offset`;

            const itemResults = await db.sequelize.query(sqlItems, {
                replacements: where,
                type: db.sequelize.QueryTypes.SELECT
            });

            let items = itemResults.map(item => {
                return {
                    symbol: item.currency,
                    reward: parseFloat((new BigNumber(item.reward))),
                    staked: parseFloat((new BigNumber(item.staked)).div(parseFloat(item.number_row)))
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
            logger.error('get asset list fail:', err);
            next(err);
        }
    }
};

function _getDateRangeUnitTimeStamp(dateType, dateNum) {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    let fromDate = 0;
    const toDate = moment(today).valueOf();
    let unit = 'minute';
    switch (dateType) {
        case 'MINUTE':
            fromDate = moment(today).subtract(dateNum, 'minute').valueOf();
            break;

        case 'HOUR':
            unit = 'hour';
            fromDate = moment(today).subtract(dateNum, 'hour').valueOf();
            break;

        case 'DAY':
            unit = 'hour';
            fromDate = moment(today).subtract(24 * dateNum, 'hour').valueOf();
            break;

        case 'WEEK':
            unit = 'day';
            fromDate = moment(today).subtract(7 * dateNum, 'day').valueOf();
            break;

        case 'MONTH':
            unit = 'month';
            fromDate = moment(today).subtract(dateNum, 'month').valueOf();
            break;

        case 'YEAR':
            unit = 'year';
            fromDate = moment(today).subtract(dateNum, 'year').valueOf();
            break;

        default:
            fromDate = moment(today).subtract(24 * dateNum, 'hour').valueOf();
            break;

    }
    const from = Math.floor(fromDate / 1000); // second
    const to = Math.floor(toDate / 1000);
    return { from, to, unit }
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

        default:
            break;
    }

    return query;
}
