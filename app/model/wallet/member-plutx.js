
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("member_plutxs", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    domain_name: {
      type: DataTypes.STRING(256),
      allowNull: false
    },  
    member_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    member_domain_name: {
      type: DataTypes.STRING(256),
      allowNull: false
    }, 
    wallet_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    platform: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    active_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
      underscored: true,
      timestamps: true,
    });
} 