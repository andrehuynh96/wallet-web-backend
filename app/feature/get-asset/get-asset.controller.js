const logger = require('app/lib/logger');
const Sequelize = require('sequelize');
const db = require("app/model/wallet");
const moment = require('moment');
const BigNumber = require('bignumber.js');

module.exports = {
    getAssetHistory: async (req, res, next) => {
        try {
            const { offset, limit } = req.query;
            console.log(req.query);
            let where = {
                memberId: req.user.id,
                offset: offset ? offset : 0,
                limit: limit ? limit : 25
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
                                w.member_id = :memberId
                        )`;

            const totalResults = await db.sequelize.query(sqlTotal, {
                replacements: where,
                type: db.sequelize.QueryTypes.SELECT
            });

            const total = parseInt(totalResults[0].total);

            let sqlItems = `SELECT 
                        platform AS currency, 
                        reward, 
                        amount AS staked, 
                        created_at
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
                        ORDER BY created_at DESC LIMIT :limit OFFSET :offset`;

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
            logger.error('get asset list fail:', err);
            next(err);
        }
    }
};
