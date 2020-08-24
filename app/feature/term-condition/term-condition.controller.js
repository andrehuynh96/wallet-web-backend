const logger = require('app/lib/logger');
const Term = require('app/model/wallet').terms;
const Member = require("app/model/wallet").members;
const MemberActivityLog = require('app/model/wallet').member_activity_logs;
const ActionType = require('app/model/wallet/value-object/member-activity-action-type');
const mapper = require("app/feature/response-schema/term-condition.response-schema");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  get: async (req, res, next) => {
    try {
      let now = new Date();
      let result = await Term.findOne({
        where: {
          is_published: true,
          applied_date: {
            [Op.lte]: now
          }
        },
        order: [['applied_date', 'DESC']],
        raw: true
      });
      if (!result) {
        return res.notFound(res.__('NOT_FOUND_TERM_CONDITION'), 'NOT_FOUND_TERM_CONDITION');
      }

      if (req.user.current_language == 'ja') {
        result.content = result.ja_content;
      }
      return res.ok(mapper(result));
    }
    catch (err) {
      logger.error('term condition fail:', err);
      next(err);
    }
  },

  set: async (req, res, next) => {
    try {
      let term = await Term.findOne({
        where: {
          id: req.params.id,
          is_published: true
        }
      });
      if (!term) {
        return res.badRequest(res.__('NOT_FOUND_TERM_CONDITION'), 'NOT_FOUND_TERM_CONDITION', { fields: ['id'] });
      }
      await Member.update({
        term_condition_date: new Date(),
        term_condition_id: term.id
      }, {
          where: {
            id: req.user.id,
          },
          returning: true
        });

      const registerIp = (req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.headers['x-client'] || req.ip).replace(/^.*:/, '');
      await MemberActivityLog.create({
        member_id: req.user.id,
        client_ip: registerIp,
        action: ActionType.AGREE_TERM_CONDITION,
        user_agent: req.headers['user-agent'],
        data: term.id
      });

      return res.ok(true);
    }
    catch (err) {
      logger.error('set term condition fail:', err);
      next(err);
    }
  }
}