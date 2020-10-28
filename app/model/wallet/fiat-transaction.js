const { Temporalize } = require('sequelize-temporalize');
const Status = require("./value-object/fiat-transaction-status");
const Provider = require("./value-object/fiat-provider");

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("fiat_transactions", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4()
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    from_currency: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    to_cryptocurrency: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    payment_method: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    from_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    to_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    to_address: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    redirect_url: {
      type: DataTypes.TEXT('medium'),
      allowNull: true
    },
    failure_redirect_url: {
      type: DataTypes.TEXT('medium'),
      allowNull: true
    },
    rate: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    fee_currency: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    total_fee: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    fee_from: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    fee_to: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    transaction_id: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    tx_id: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    tx_status: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: Status.NEW
    },
    provider: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: Provider.SENDWYRE
    },
    message: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    },
    response: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    },
    device_code: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
  }, {
      underscored: true,
      timestamps: true,
    });

  Temporalize({
    model: Model,
    sequelize,
    temporalizeOptions: {
      blocking: false,
      full: false,
      modelSuffix: "_his"
    }
  });

  Model.associate = (models) => {
    Model.belongsTo(models.members, {
      as: 'Member',
      foreignKey: 'member_id',
      targetKey: 'id'
    });
  };

  return Model;
} 