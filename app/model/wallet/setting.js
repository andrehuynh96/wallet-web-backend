module.exports = (sequelize, DataTypes) => {
    return sequelize.define("settings", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      key: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      value: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      property: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      updated_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    }, {
        underscored: true,
        timestamps: true,
      });

  };
