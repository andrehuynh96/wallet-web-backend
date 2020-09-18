const { Temporalize } = require('sequelize-temporalize');
module.exports = (sequelize, DataTypes) => {
  const Wallet = sequelize.define("wallets", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    default_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    encrypted_passphrase: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    backup_passphrase_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    deleted_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    order_index: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
      underscored: true,
      timestamps: true,
    });
  Temporalize({
    model: Wallet,
    sequelize,
    temporalizeOptions: {
      blocking: false,
      full: false,
      modelSuffix: "_his"
    }
  });

  Wallet.associate = (models) => {
    Wallet.hasMany(models.wallet_tokens, { foreignKey: 'wallet_id'});
    Wallet.hasMany(models.wallet_priv_keys, { foreignKey: 'wallet_id' });
    Wallet.belongsTo(models.members, { foreignKey: 'member_id', targetKey: 'id' });
  };
  return Wallet;
}
