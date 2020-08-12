module.exports = (sequelize, DataTypes) => {
  const Wallet = sequelize.define("validators", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    platform: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(256),
      allowNull: true,
    }
  }, {
      underscored: true,
      timestamps: true,
    });

  return Wallet;
} 