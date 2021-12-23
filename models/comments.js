'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate( {Restaurants, Users} ) {
      this.belongsTo(Restaurants, { foreignKey: 'restaurant_id', as: 'restaurant' });
      this.belongsTo(Users, { foreignKey: 'user_id', as: 'user' });
    }
  };
  Comments.init({
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    posted: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Comments',
  });
  return Comments;
};