const logger = require("app/lib/logger");
const config = require("app/config");
const Member = require("app/model/wallet").members;
const PluTXUserIdApi = require('app/lib/plutx-userid');
const MemberStatus = require("app/model/wallet/value-object/member-status");
const Sequelize = require('sequelize');
const { forEachSeries } = require('p-iteration');

const Op = Sequelize.Op;
const delay = time => new Promise(res => setTimeout(() => res(), time));

module.exports = async () => {
  if (!config.plutxUserID.isMigrationEnabled) {
    return;
  }

  logger.info('Migrating members starts.');
  const members = await Member.findAll({
    where: {
      plutx_userid_id: {
        [Op.or]: [
          { [Op.eq]: null },
        ]
      },
      deleted_flg: false,
    },
    order: [['created_at', 'ASC']]
  });

  await forEachSeries(members, async (member) => {
    if (member.plutx_userid_id) {
      return;
    }

    logger.info('Processing', member.email);
    await delay(200);

    try {
      const result = await PluTXUserIdApi.importUser({
        email: member.email,
        password: member.password_hash,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
        emailConfirmed: member.member_sts === MemberStatus.ACTIVATED ? true : false,
        isActived: true,
      });

      if (result.httpCode === 200) {
        member.plutx_userid_id = result.data.id;
        await member.save();
      } else {
        logger.info('Importing member failed.', result.httpCode, result.data);
      }
    } catch (err) {
      logger.info('Importing member failed.', err);
    }

  });

  logger.info('Migrating members have done.');
};
