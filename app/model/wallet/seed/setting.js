const Model = require("app/model/wallet").settings;

const SETTINGS = [
  {
    "key": "SEND_EMAIL",
    "value": "1",
    "type": "string",
    "property": "send_email"
  },
  {
    "key": "ADMIN_EMAIL_ADDRESS",
    "value": "myhn@blockchainlabs.asia",
    "type": "string",
    "property": "admin_email_address"
  },
  {
    "key": "ENABLE_FREE_MEMBERSHIP_FLG",
    "value": "true",
    "type": "string",
    "property": "enable_free_membership_flg"
  },
  {
    "key": "NUM_OF_MEMBERSHIPS",
    "value": "1",
    "type": "number",
    "property": "num_of_memberships"
  },
  {
    "key": "UPGRADE_PAID_MEMBER_FLG",
    "value": "true",
    "type": "boolean",
    "property": "upgrade_paid_member_flg"
  },
  {
    "key": "ALLOW_UPGRADE_FLG",
    "value": "true",
    "type": "boolean",
    "property": "allow_upgrade_flg"
  },
  {
    "key": "NUM_OF_PAID_MEMBERS",
    "value": "5",
    "type": "number",
    "property": "num_of_paid_members"
  },
  {
    "key": "NUM_OF_FREE_MEMBERS",
    "value": "5",
    "type": "number",
    "property": "num_of_free_members"
  },
  {
    "key": "STAKING_AMOUNT",
    "value": "5",
    "type": "number",
    "property": "staking_amount"
  },
  {
    "key": "STAKING_AMOUNT_CURRENCY_SYMBOL",
    "value": "USD",
    "type": "string",
    "property": "staking_amount_currency_symbol"
  },
  {
    "key": "STAKING_REWARD",
    "value": "5",
    "type": "number",
    "property": "staking_reward"
  },
  {
    "key": "STAKING_REWARD_CURRENCY_SYMBOL",
    "value": "USD",
    "type": "string",
    "property": "staking_reward_currency_symbol"
  },
  {
    "key": "MEMBERSHIP_TYPE_FREE_MEMBERSHIP_FLG",
    "value": "true",
    "type": "boolean",
    "property": "membership_type_free_membership_flg"
  },
  {
    "key": "MEMBERSHIP_TYPE_UPGRADE_PAID_MEMBER_FLG",
    "value": "false",
    "type": "boolean",
    "property": "membership_type_upgrade_paid_member_flg"
  },
  {
    "key": "UPGRADE_TO_MEMBERHIP_TYPE_ID",
    "value": "",
    "type": "string",
    "property": "upgrade_to_memberhip_type_id"
  }
];

(async () => {
  const models = [];

  for (let item of SETTINGS) {
    let setting = await Model.findOne({
      where: {
        key: item.key,
      }
    });

    if (!setting) {
      setting = {
        key: item.key,
        value: item.value,
        type: item.type,
        property: item.property,
        created_by: 0,
        updated_by: 0,
      };

      models.push(setting);
    }
  }

  await Model.bulkCreate(
    models,
    {
      returning: true
    });

})();
