'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate( {Foods, Comments} ) {
      this.hasMany(Foods, { foreignKey: 'restaurant_id', as: 'foods', onDelete: 'cascade', hooks: true });
      this.hasMany(Comments, { foreignKey: 'restaurant_id', as: 'comments', onDelete: 'cascade', hooks: true });
    }
  };
  Restaurants.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    kitchen: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    delivery_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Restaurants',
  });
  return Restaurants;
};