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
    name: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    roa: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    size: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    bpe: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    fees: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    fees_avg: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    pledge: {
      type: DataTypes.STRING(256),
      allowNull: true,
    }
  }, {
      underscored: true,
      timestamps: true,
    });

  return Wallet;
} 