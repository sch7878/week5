//router 생성
const express = require('express');
const router = express.Router();
const {Posts} = require('../models/index.js')
const { Op } = require("sequelize");
const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken");
const auth_middleware = require('../middleware/auth_middleware.js');
router.use(cookieParser());


//게시글 작성
router.post("/posts", auth_middleware, async (req,res) =>{
  const {title,content} = req.body;
  const {user} = res.locals;
  const likes = 0;

  try {
    const createdPosts = await Posts.create({
      userId:user.userId,nickname:user.nickname,title,content,likes
    })
  
    return res.status(200).json({
      success : true,
      Message : "게시글 작성이 완료되었습니다"
  })
  } catch (err){
    console.log(err)
    return res.status(400).json({
      success : false,
      Message : "게시글 작성에 실패하였습니다."
  })
  }
})

//게시글 조회
router.get('/posts',  async (req,res) =>{
  const posts = await Posts.findAll({
    attributes: ["postId","userId","nickname","title","createdAt","updatedAt","likes"],
    order: [['createdAt', 'desc']],
})
return res.json({ 
  posts, 
});


})

//게시글 상세 조회
router.get("/posts/:postId", async (req,res) => {
  const {postId} = req.params;

  try {
  const post = await Posts.findOne({
    where :{ postId: Number(postId)},
    attributes: ["postId","userId","nickname","title","content","createdAt","updatedAt","likes"],
    order: [['createdAt', 'desc']],
  });

  if(!post) {
    return res.status(400).json({
      success: false, 
      errorMessage:"게시글이 존재하지 않습니다."
    })
  }

    res.status(200).json({
      "data" : post
    })
  } catch {
    return res.status(400).json({
      success: false, 
      errorMessage:"데이터형식이 올바르지 않습니다"
    })
  
 
}

})




//게시글 수정
router.put("/posts/:postId", auth_middleware, async (req,res) => {
  const {postId} = req.params;
  const {title, content} = req.body;
  const post = await Posts.findOne({where : {postId:postId}});
  const {user} = res.locals;

 
  if(post.userId !== user.userId) {
    return res.status(400).json({
      success:false, 
      errorMessage:'작성자가 아닙니다.'
    })
    
  }
  
  
 try {
  if(!post) {
    res.status(400).json({
      success:false, 
      errorMessage:'게시글이 존재하지 않습니다.'
    })
  } else if(!title) {
    res.status(412).json({
      success:false, 
      errorMessage: "게시글 제목의 형식이 일치하지 않습니다."
    })
  } else if(!content) {
    res.status(412).json({
      success:false, 
      errorMessage: "게시글 내용의 형식이 일치하지 않습니다."
    })
  } else {
   await Posts.update(
      {title: title, content: content }, 
      {where: { postId: Number(postId)}}
    )
    res.json({ 
      success: true, 
      Message: "게시글을 수정하였습니다." 
    });
    return;
  } 
 } catch {
  res.status(401).json({
    success:false, 
    errorMessage:"게시글이 정상적으로 수정되지 않았습니다."
  })
 }

 


  
})

//게시글 삭제
router.delete("/posts/:postId", auth_middleware, async (req,res) => {
  const {postId} = req.params;
  const {user} = res.locals;
  
  const post = await Posts.findOne({where : {postId:Number(postId)}});

  if(post.userId !== user.userId) {
    return res.status(400).json({
      success:false, 
      errorMessage:'작성자가 아닙니다.'
    })
    
  }

  if(!post) {
    return res.status(404).json({
      success : false,
      errorMessage : "게시글이 존재하지 않습니다."
    })
  }

  try {
    await Posts.destroy(
        {where: { postId: Number(postId)}}
      )
      return res.json({ 
        success: true, 
        Message: "게시글을 삭제하였습니다." 
      });
      
      
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      success:false, 
      errorMessage:"게시글 삭제에 실패하였습니다."
    })
  }

 
})

//게시글 좋아요 등록
router.put("/posts/:postID/like", auth_middleware, async (req,res) => {
  
  const post = await Posts.findOne({where : {postId:Number(postId)}});
}) 





module.exports = router;

