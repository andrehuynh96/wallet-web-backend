
const StakingPlatformStatus = require("./value-object/staking-platform-status");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("staking_platforms", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    symbol: {
      type: DataTypes.STRING(8),
      allowNull: false
    },
    icon: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT('medium'),
      allowNull: true
    },
    order_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    estimate_earn_per_year: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    },
    lockup_unvote: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    lockup_unvote_unit: {
      type: DataTypes.STRING(8),
      allowNull: false
    },
    payout_reward: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    payout_reward_unit: {
      type: DataTypes.STRING(8),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: StakingPlatformStatus.COMMING_SOON
    },
    confirmation_block: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5
    },
    staking_type: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    sc_lookup_addr: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    sc_token_address: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    validator_address: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    deleted_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
      underscored: true,
      timestamps: true,
    });
} 