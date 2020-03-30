const ActionType = require("./value-object/member-activity-action-type");
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
	}, {
		underscored: true,
		timestamps: true,
	});
} 