var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.redirect("/");
});

/* POST users listing. */
router.post('/', function(req, res, next) {

	var post = mongoose.model('post');
    var search = req.body.searchText;
    var ch = req.body.radiosHeader;
    if(ch == "on") 
        ch = true;
    else
        ch = false;
    var cf = req.body.radiosFull;
    if(cf == "on") 
        cf = true;
    else
        cf = false;
    if(ch && !cf)
        post.find({ $or: [ {header : { $regex: "^" +search+" "}} , {header : { $regex: " " +search+" "}}]}).sort({id : -1}).exec(searchFunc);
    if(!ch && cf)
        post.find({ $or: [ {fullСontent : { $regex: "^" +search+" "}} , {fullСontent : { $regex: " " +search+" "}}]}).sort({id : -1}).exec(searchFunc);
    if(ch && cf)
        post.find({ $or: [ {header : { $regex: "^" +search+" "}} , {header : { $regex: " " +search+" "}},{fullСontent : { $regex: "^" +search+" "}} , {fullСontent : { $regex: " " +search+" "}}]}).sort({id : -1}).exec(searchFunc);
	if(!ch && !cf)
        post.find({ $or: [ {header : { $regex: "^" +search+" "}} , {header : { $regex: " " +search+" "}}]}).sort({id : -1}).exec(searchFunc);

    function searchFunc(err, posts){
        if (err){
        	return console.error(err);
        	res.render('error', { message: 'Erorr', error: err});
        } 
        else{
			res.render('search', { title: 'Search', style : req.cookies.style, posts: posts});
		}
    }
});
module.exports = router;
