const logger = require('app/lib/logger');
const Sequelize = require('sequelize');
const db = require("app/model/wallet");
const moment = require('moment');
const Joi = require('joi');
const BigNumber = require('bignumber.js');
const { schema } = require('./validator');

module.exports = {
    getAssetList: async (req, res, next) => {
        try {
            const validate = Joi.validate(req.query, schema);
            if (validate.error) {
                console.log(validate.error);
                return res.badRequest("Missing parameters", validate.error);
            }

            let { type, platform } = req.query;
            type = type ? type.trim().toUpperCase() : 'ALL';
            platform = platform ? platform.trim().toUpperCase() : 'ALL';
            let { from, to } = _getDateRangeUnitTimeStamp(type.toUpperCase(), 1);

            let where = {
                memberId: req.user.id,
                platform,
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
                        )  
                        ${'ALL' !== type ? ' AND created_at >= TO_TIMESTAMP(:from) AND created_at <= TO_TIMESTAMP(:to)' : ''} 
                        ${'ALL' !== platform ? ' AND platform = :platform ' : ''}
                        GROUP BY ct, currency ORDER BY currency`;

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
                begin_date: to,
                end_date: from,
                type
            });
        }
        catch (err) {
            logger.error('get asset list fail:', err);
            next(err);
        }
    },
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
            query = `CONCAT(
                DATE_PART('YEAR', ${columnName}),
                '-',
                DATE_PART('WEEK', ${columnName}))`;
            break;

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
