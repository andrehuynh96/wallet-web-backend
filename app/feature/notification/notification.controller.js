const logger = require('app/lib/logger');
const Notification = require('app/model/wallet').notifications;
const NotificationDetails = require('app/model/wallet').notification_details;
const Member = require('app/model/wallet').members;
const mapper = require('app/feature/response-schema/notification.response-schema');
const Sequelize = require('sequelize');

module.exports = {
    getAll: async(req, res, next) => {
        try {
            const { query } = req;
            const limit = query.limit ? parseInt(req.query.limit) : 10;
            const offset = query.offset ? parseInt(req.query.offset) : 0;
            const filter = query.filter ? req.query.filter : 'all';

            const userId = req.user.id;
            let selected_lang = await _getMemberCurrentLanguage(userId);

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
    },

    getMessage: async(req, res, next) => {
        try {
            const { params: { message_id } } = req;

            const userId = req.user.id;
            let selected_lang = await _getMemberCurrentLanguage(userId);

            let where_notification_details = {
                member_id: userId,
                notification_id: message_id,
                deleted_flg: false
            };

            const user_notification = await NotificationDetails.findOne({
                where: where_notification_details,
                include: [{
                    model: Notification,
                    as: "Notification"
                }],
                order: [
                    ['created_at', 'DESC']
                ]
            });

            return res.ok(mapper(user_notification, selected_lang));
        } catch (err) {
            logger.error('getMessage fail:', err);
            next(err);
        }
    },

    deleteMessage: async(req, res, next) => {
        try {
            const message_ids = req.body.message_ids;

            const userId = req.user.id;


            let where_notification_details = {
                member_id: userId
            };

            if (message_ids && message_ids.length && message_ids.length > 0) {
                where_notification_details.notification_id = message_ids;
            }

            NotificationDetails.update({
                deleted_flg: true
            }, { where: where_notification_details });

            return res.ok(true);
        } catch (err) {
            logger.error('deleteMessage fail:', err);
            next(err);
        }
    },

    markReadMessage: async(req, res, next) => {
        try {
            const message_ids = req.body.message_ids;

            const userId = req.user.id;

            let where_notification_details = {
                member_id: userId,
                deleted_flg: false
            };

            if (message_ids && message_ids.length && message_ids.length > 0) {
                where_notification_details.notification_id = message_ids;
            }

            NotificationDetails.update({
                read_flg: true
            }, { where: where_notification_details });

            return res.ok(true);
        } catch (err) {
            logger.error('markReadMessage fail:', err);
            next(err);
        }
    },

    countUnreadMessage: async(req, res, next) => {
        try {
            const userId = req.user.id;

            let where_notification_details = {
                member_id: userId,
                read_flg: false,
                deleted_flg: false
            };


            var total = await NotificationDetails.count({ where: where_notification_details });
            return res.ok(total);
        } catch (err) {
            logger.error('countUnreadMessage fail:', err);
            next(err);
        }
    },
}

async function _getMemberCurrentLanguage(userId) {
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
    return selected_lang;
}