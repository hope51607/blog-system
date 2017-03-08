require('../lib/db');
var express = require('express');
var router = express.Router();
var mongoose =require('mongoose');
var Blog = mongoose.model('Blog');
var Comment = mongoose.model('Comment');

/* GET users listing. */

//註冊
router.get('/register',function(req, res, next){
	if(req.session.logined){
		res.redirect('/');
		return;
	}
	res.render('users/register');
});

//登入
router.get('/signin',function(req,res,next){
	if(req.session.logined){
		res.redirect('/');
		return;
	}
	res.render('users/signin');
});

//登出
router.get('/signout',function(req,res,next){
	req.session.logined=false;
	res.redirect('/');
	res.end();
});

//忘記
router.get('/forget',function(req,res,next){
	if(req.session.logined){
		res.redirect('/');
		return;
	}
	res.render('users/forget');	
});

//管理
router.get('/profile',function(req,res,next){
	if(!req.session.logined||!req.session.username){
		res.redirect('/');
		return;
	}
	res.locals.username=req.session.username;
	res.locals.authenticated=req.session.logined;
	Blog.find({Username:req.session.username},function(err, blogs ,count){
		res.render('users/profile',{
			title: 'Blog System',
			blogs: blogs
		});
	}).sort({CreateDate:-1});
});

//新增
router.get('/add_article',function(req,res,next){
	if(!req.session.logined||!req.session.username){
		res.redirect('/');
		return;
	}
	res.locals.username = req.session.username;
	res.locals.authenticated = req.session.logined;
	res.render('users/add_article');
});

//修改
router.get('/modify/:id',function(req,res,next){
	if(!req.session.logined||!req.session.username){
		res.redirect('/');
		return;
	}
	res.locals.username = req.session.username;
	res.locals.authenticated = req.session.logined;
	res.locals.messageID= req.params.id;
	Blog.find({_id: req.params.id},function(err,blogs,count){
		res.render('users/modify',{
			blogs:blogs
		});
	});
});

//留言
router.get('/message/:id',function(req,res,next){
	if(!req.session.logined||!req.session.username){
		res.redirect('/');
		return;
	}
	res.locals.username = req.session.username;
	res.locals.authenticated = req.session.logined;
	res.locals.messageID= req.params.id;
	Blog.find({_id: req.params.id},function(err,blogs,count){
		Comment.find({MessageID:req.params.id},function(err,comments,count){
			res.render('users/message',{
				blogs:blogs,
				comments:comments
			});
		}).sort({CreateDate:-1});
	});
});

module.exports = router;
