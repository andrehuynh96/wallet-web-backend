const logger = require("app/lib/logger");
const config = require("app/config");
const Member = require("app/model/wallet").members;
const PluTXUserIdApi = require('app/lib/plutx-userid');
const MemberStatus = require("app/model/wallet/value-object/member-status");
const Sequelize = require('sequelize');
const { forEach } = require('p-iteration');

const Op = Sequelize.Op;
const IS_ENABLED_PLUTX_USERID = config.plutxUserID.isEnabled;

const delay = time => new Promise(res => setTimeout(() => res(), time));

module.exports = async () => {
  if (!IS_ENABLED_PLUTX_USERID) {
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
    }
  });

  await forEach(members, async (member) => {
    if (member.plutx_userid_id) {
      return;
    }
    console.log(member.email);

    await delay(1000);
    // const result = await PluTXUserIdApi.importUser({
    //   email: member.email,
    //   password: member.password_hash,
    //   createdAt: member.createdAt,
    //   updatedAt: member.updatedAt,
    //   emailConfirmed: member.member_sts === MemberStatus.ACTIVATED ? true : false,
    //   isActived: true,
    // });

    // if (result.httpCode === 200) {
    //   member.plutx_userid_id = result.data.id;
    //   await member.save();
    // } else {
    //   logger.info('Importing member failed.', result.httpCode, result.data);
    // }

  });

  logger.info('Migrating members have done.');
};
