module.exports = (sequelize, DataTypes) => {
  return sequelize.define("member_unsubscribe_reasons", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    question: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    answer: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    token: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    confirm_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    email: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    fullname: {
      type: DataTypes.STRING(64),
      allowNull: true
    }
  }, {
      underscored: true,
      timestamps: true,
    });
} 