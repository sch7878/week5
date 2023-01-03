//router 생성
const express = require('express');
const router = express.Router();
const {Users, Posts, Comments} = require('../models/')
const { Op, where } = require("sequelize");
const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken");
const auth_middleware = require('../middleware/auth_middleware.js');
router.use(cookieParser());

//댓글 작성
router.post("/comments/:postId", auth_middleware, async (req,res) =>{
  const {comment} = req.body;
  const {postId} = req.params;
  const {user} = res.locals;
  const post = await Posts.findOne({
    where :{ postId: Number(postId)},
  })

  console.log(postId)
  console.log(post.postId)



  try {
    if(Number(postId) !== Number(post.postId)) {
      return res.status(412).json({
        success : false,
        Message : "데이터 형식이 올바르지 않습니다."
    })
    } else {
     const createdComments = await Comments.create({
      userId:user.userId,postId,nickname:user.nickname,comment
      })
  
      return res.status(200).json({
        success : true,
        Message : "댓글 작성이 완료되었습니다"
      }) 
    }
  } catch (err){
    console.log(err)
    return res.status(400).json({
      success : false,
      Message : "댓글 작성에 실패하였습니다."
  })
  }
})

//댓글 조회
router.get('/comments/:postId',  async (req,res) =>{
  const {postId} = req.params;

  const comments = await Comments.findAll({
    where :{ postId: Number(postId)},
    attributes: ["commentId", "postId", "userId","nickname","comment","createdAt","updatedAt"],
    order: [['createdAt', 'desc']],
})
return res.json({ 
  comments, 
});
})

//댓글 수정
router.put("/comments/:commentId", auth_middleware, async (req,res) => {
  const {commentId} = req.params;
  const {comment} = req.body;
  const comments = await Comments.findOne({where :{commentId:Number(commentId)}});
  const {user} = res.locals;

  
  if(comments.userId !== user.userId) {
    return res.status(400).json({
      success:false, 
      errorMessage:'작성자가 아닙니다.'
    })
    
  }
  
  
 try {
  if(!comments) {
    return res.status(400).json({
      success:false, 
      errorMessage:'댓글이 존재하지 않습니다.'
    });
  } else if(!comment) {
    return res.status(412).json({
      success:false, 
      errorMessage: "댓글 내용의 형식이 일치하지 않습니다."
    });
  } else {
   await Comments.update(
      {comment : comment}, 
      {where: { commentId: Number(commentId)}}
    )
    res.json({ 
      success: true, 
      Message: "댓글을 수정하였습니다." 
    });
    return;
  } 
 } catch {
  res.status(401).json({
    success:false, 
    errorMessage:"댓글이 정상적으로 수정되지 않았습니다."
  })
 }

})


//댓글 삭제
router.delete("/comments/:commentId", auth_middleware, async (req,res) => {
  const {commentId} = req.params;
  const {user} = res.locals;
  
  const comments = await Comments.findOne({where :{commentId:Number(commentId)}});

  if(comments.userId !== user.userId) {
    return res.status(400).json({
      success:false, 
      errorMessage:'작성자가 아닙니다.'
    })
    
  }

  if(!comments) {
    return res.status(404).json({
      success : false,
      errorMessage : "댓글이 존재하지 않습니다."
    })
  }

  try {
    await Comments.destroy(
      {where :{commentId:Number(commentId)}}
      )
      return res.json({ 
        success: true, 
        Message: "댓글을 삭제하였습니다." 
      });
      
      
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      success:false, 
      errorMessage:"댓글 삭제에 실패하였습니다."
    })
  }

 
})
  

module.exports = router;