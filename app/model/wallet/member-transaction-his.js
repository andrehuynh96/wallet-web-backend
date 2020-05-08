const ActionType = require("./value-object/member-activity-action-type");
const timeUnit = require("./value-object/time-unit");
module.exports = (sequelize, DataTypes) => {
  const MemberTransactionHis = sequelize.define("member_transaction_his", {
    member_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    tx_id: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    platform: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    symbol: {
      type: DataTypes.STRING(8),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    action: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: ActionType.SEND
    },
    send_email_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    from_address: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    to_address: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    sender_note: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    receiver_note: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    staking_platform_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    plan_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    duration_type: {
      type: DataTypes.STRING(8),
      allowNull: true
    },
    reward_percentage: {
      type: DataTypes.DOUBLE(4, 2),
      allowNull: true
    },
    validator_fee: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    domain_name: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    member_domain_name: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
  }, {
    underscored: true,
    timestamps: true,
  });
  MemberTransactionHis.associate = (models) => {
    // associations can be defined here
    MemberTransactionHis.belongsTo(models.member_plutxs, { foreignKey: 'domain_name', targetKey: 'domain_name' })
  };
  return MemberTransactionHis;
} 