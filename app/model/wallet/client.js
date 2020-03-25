module.exports = (sequelize, DataTypes) => {
  return sequelize.define("clients", {
    client_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    client_secret: {
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
    redirect_uris: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    grants: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    allow_scopes: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    allowed_origins: {
      type: DataTypes.TEXT('medium'),
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
  }, {
      underscored: true,
      timestamps: true,
    });
} 