var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.redirect("/");
});

router.get('/:page/', function(req, res, next) {

    var page = [req.params.page] - 1;
	var post = mongoose.model('post');

	post.find().sort({id : -1}).exec(function (err, posts) {
        if (err){
        	return console.error(err);
        	res.render('error', { message: 'Erorr', error: err});
        } 
        else{
        	var postInPage= [];
        	posts.forEach(function(element, index) {
    			if (Math.floor(index/10) == page){
    				postInPage.push(element);
    			}
			});
			page++;
			var allPage = Math.floor(posts.length/10)+1;
			res.render('news', { title: 'News', style : req.cookies.style,  posts: postInPage, page: page, allPage: allPage });
		}
    });

});

router.get('/*/:postId/', function(req, res, next) {
	var post = mongoose.model('post');
	var id = [req.params.postId];

	post.find(function (err, posts) {
        if (err){
        	return console.error(err);
        	res.render('error', { message: 'Erorr', error: err});
        } 
        else{
        	posts.forEach(function(element, index) {
    			if (element.id == id){
    				res.render('post', { title: element.header, style : req.cookies.style, post: element});

    			}
			});
		}
    });
});

module.exports = router;
