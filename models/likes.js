'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 1. Posts 모델에서
      this.belongsTo(models.Posts, { // 2. Posts 모델에게 1:1 관계 설정을 합니다.
        sourceKey: 'postId', // 3. Likes 모델의 postId 컬럼을
        foreignKey: 'postId', // 4. Posts 모델의 postId 컬럼과 연결합니다.
      });
        
        this.belongsTo(models.Users, { // 2. Users 모델에게 N:1 관계 설정을 합니다.
          targetKey: 'userId', // 3. Users 모델의 userId 컬럼을
          foreignKey: 'userId', // 4. Posts 모델의 UserId 컬럼과 연결합니다.
        });
    }
  }
  Likes.init({
    likeId: {
      allowNull: false, // NOT NULL
      autoIncrement: true, // AUTO_INCREMENT
      primaryKey: true, // Primary Key (기본키)
      type: DataTypes.INTEGER,
    },
    postId: {
      allowNull: false, // NOT NULL
      type: DataTypes.INTEGER,
    },
    userId: {
      allowNull: false, // NOT NULL
      type: DataTypes.INTEGER,
    },
    nickname: {
      allowNull: false, // NOT NULL
      type: DataTypes.STRING,
    },
    title: {
      allowNull: false, // NOT NULL
      type: DataTypes.STRING,
    },
    likes: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'Likes',
    timestamps: true,
  });
  return Likes;
};