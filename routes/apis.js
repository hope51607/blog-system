require('../lib/db');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Blog = mongoose.model('Blog');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

/* 處理些post的東東 */

//刪除
router.get('/delete/:id', function(req, res, next) {
	Blog.remove({_id: req.params.id},function(err){
		if(err)
			console.log("刪除失敗");
		else
			console.log("刪除成功");
	});
	res.redirect('/users/profile');
});

router.post('/register',function(req,res,next){
	if ((!req.body.user)||(!req.body.passwd)) {
		res.redirect('/users/register');
		return;
	}
	new User({
		Username:req.body.user,
		Passwd:req.body.passwd
	}).save(function(err){
		if(err)
			console.log("errrr");
	});
	req.session.username=req.body.user;
	req.session.logined=true;
	res.redirect('/');
});

//登入處理
router.post('/login',function(req,res,next){
	var flag =false;
	if ((!req.body.user)||(!req.body.passwd)) {
		res.redirect('/users/signin');
		return;
	}

	// step1(function(){
	// 	step2(function(){
	// 		if(!flag){
	// 			res.redirect('/users/signin');
	// 			return;
	// 		}
	// 		req.session.username=req.body.user;
	// 		req.session.logined=true;
	// 		res.redirect('/');
	// 	})
	// 	if(users[0]){
	// 		flag=true;
	// 		console.log(users[0]);
	// 	}
	// });

	// User.find({Username:req.body.user,Passwd:req.body.passwd},function(err,users,count){
	// 	if(users[0]){
	// 		flag=true;
	// 		console.log(users[0]);
	// 	}
	// });
	// if(!flag){
	// 	res.redirect('/users/signin');
	// 	return;
	// }
	req.session.username=req.body.user;
	req.session.logined=true;
	res.redirect('/');
});

//新增文章處理
router.post('/add',function(req,res,next){
	if(!req.session.username||!req.session.logined){
		res.redirect('/');
		return;
	}
	new Blog({
		Username: req.session.username,
		Article: req.body.Content,
		CreateDate:Date.now()

	}).save(function(err){
		if(err){
			console.log("ERRRRRRRRRRR");
			return;
		}
		console.log("Save to db successs");
		res.redirect('/');
	});

});

//更新文章處理
router.post('/update/:id',function(req,res,next){
	if(!req.params.id){
		res.redirect('/');
		return;
	}
	Blog.update({_id:req.params.id},{Article: req.body.Content},function(err){
		if(err)console.log("更新文章失敗");
		else console.log("更新成功");
	})
	res.redirect('/users/profile');
});

//文章留言處理
router.post('/comment/:id',function(req,res,next){
	if(!req.params.id){
		res.redirect('/');
		return;
	}
	new Comment({
		Visitor: req.body.Visitor,
		Comment: req.body.Comment,
		MessageID: req.params.id,
		CreateDate:Date.now()
	}).save(function(err){
		if(err){
			console.log('存入資料庫失敗');
			return;
		}
		console.log('存入資料庫成功');
	});
	res.redirect('/users/message/'+req.params.id);
});

module.exports = router;
