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
    deleted_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
  return Wallet;
} 