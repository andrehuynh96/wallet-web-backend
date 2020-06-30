const KycStatus = require('./value-object/kyc-status');

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('member_kycs', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    kyc_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: KycStatus.IN_REVIEW
    },
  }, {
      underscored: true,
      timestamps: true,
    });


  Model.associate = (models) => {
    Model.belongsTo(models.members, {
      as: 'Member',
      foreignKey: 'member_id',
      targetKey: 'id'
    });
    Model.belongsTo(models.kycs, {
      as: 'Kyc',
      foreignKey: 'kyc_id',
      targetKey: 'id'
    });
  };

  return Model;
};
