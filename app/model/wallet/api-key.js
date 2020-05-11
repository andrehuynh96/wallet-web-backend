module.exports = (sequelize, DataTypes) => {
  return sequelize.define("api_keys", {
    api_key: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    secret: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT('medium'),
      allowNull: true
    },
    actived_flg: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
  }, {
      underscored: true,
      timestamps: true,
    });
} 