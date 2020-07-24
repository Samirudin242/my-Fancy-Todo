'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize
  const Model = Sequelize.Model
  class Todo extends Model {}
  Todo.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args : true,
          msg: `Data can't be empty`
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args : true,
          msg: `Data can't be empty`
        }
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args : true,
          msg: `Data can't be empty`
        }
      }
    },
    due_date: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args : true,
          msg: `Data can't be empty`
        }
      }
    }
  }, {sequelize});
  Todo.associate = function(models) {
    // associations can be defined here
    Todo.belongsTo(models.User)
  };
  return Todo;
};

