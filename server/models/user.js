'use strict';
const {encrypt} = require('../helper/bcrypt')
module.exports = (sequelize, DataTypes) => {
  const Sequelize  = sequelize.Sequelize
  const Model = Sequelize.Model
  class User extends Model {}
  User.init({
    email: {
      type:DataTypes.STRING,
      validate: {
        notEmpty:{
          arg: true,
          msg: `email can't be empty`
        }
      }
    },
    password: {
      type:DataTypes.STRING,
      validate:{
        notEmpty:{
          arg:true,
          msg:`password can't be empty`
        }
      }
    }
  }, {sequelize,
    hooks: {
      beforeCreate: (user) => {
        user.password = encrypt(user.password)
      }
    }
  });
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Todo)
  };
  return User;
};