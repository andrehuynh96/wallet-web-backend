const ActionType = require("./value-object/member-activity-action-type");
const timeUnit = require("../staking/value-object/time-unit");
module.exports = (sequelize, DataTypes) => {
	return sequelize.define("member_transaction_his", {
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
		memo: {
			type: DataTypes.STRING(256),
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
		}
	}, {
		underscored: true,
		timestamps: true,
	});
} 