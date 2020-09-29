const logger = require('app/lib/logger');
const config = require('app/config');
const Notification = require('app/model/wallet').notifications;
const NotificationDetails = require('app/model/wallet').notification_details;
const Member = require('app/model/wallet').members;
const mapper = require('app/feature/response-schema/notification.response-schema');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
    getAll: async(req, res, next) => {
        try {
            const { query } = req;
            const limit = query.limit ? parseInt(req.query.limit) : 10;
            const offset = query.offset ? parseInt(req.query.offset) : 0;
            const filter = query.filter ? req.query.filter : 'all';

            const userId = req.user.id;
            let selected_lang = 'en';

            let member = await Member.findOne({
                where: {
                    id: userId,
                    deleted_flg: false
                }
            });
            if (member && member.current_language) {
                selected_lang = member.current_language;
            }

            let where_notification_details = {
                member_id: userId,
                deleted_flg: false
            };

            switch (filter) {
                case 'read':
                    where_notification_details.read_flg = true;
                    break;
                case 'unread':
                    where_notification_details.read_flg = false;
                    break;
            }

            const { count: total, rows: items } = await NotificationDetails.findAndCountAll({
                limit,
                offset,
                where: where_notification_details,
                include: [{
                    model: Notification,
                    as: "Notification"
                }],
                order: [
                    ['created_at', 'DESC']
                ]
            });

            return res.ok({
                items: mapper(items, selected_lang),
                offset: offset,
                limit: limit,
                total: total
            });
        } catch (err) {
            logger.error('get list notification fail:', err);
            next(err);
        }
    }
}