var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

	var post = mongoose.model('post');

	post.find(function (err, posts) {
        if (err){
        	return console.error(err);
        	res.render('error', { message: 'Erorr', error: err});
        } 
        else{
			res.render('news', { title: 'News', posts: posts});
		}
    });

});

router.get('/post-:postId/', function(req, res, next) {
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
                    var lol = "привет";
                    lol = element.header.replace('брата','*');
                    console.log(lol);
    				res.render('post', { title: element.header, post: element});

    			}
			});
		}
    });
});

module.exports = router;
