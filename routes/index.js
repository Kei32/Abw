var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request = require("request");
var cheerio = require("cheerio");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Parsing s13 Express' });
});

router.get('/update', function(req, res, next) {

	var url = "http://s13.ru/";
 
	request(url, function (error, res, body) {
    	if (error) {
        	console.log('Couldn’t get page because of error: ' + error);
      		return;
    	}
    	var $ = cheerio.load(body);

		var post = mongoose.model('post');

    	function dbSave(id ,header, picture, summary, post)
    	{
      		var urlNews = "http://s13.ru/archives/"+ id;
      		request(urlNews, function (error, res, body) {
        		if (error) {
            		console.log('Couldn’t get page because of error: ' + error);
            		return;
        		}
        
       			var fullСontent = "";
        		var $ = cheerio.load(body);
       			$('div [class="item entry"]').children('div [class="itemtext"]').children('p').each(function(i, elem) {
        		fullСontent += $(this).text();
        		});

        		

        		var newPost = new post({ 
        			id: id,
        			header: header,
        			summary: summary,
        			fullСontent: fullСontent,
        			picture: picture
        		});
        		post.find({ id: id },function (err, post) {
          			if (err){
          				return console.error(err);
          			} 
          			if (post.length == 0)
          			{
           				newPost.save(function (err, newPost) {
              				if (err) return console.error(err);
           				});
          			}
        		});
      		});
    	}

    	var summary;
    	var id;
    	var header;
    	var picture;

    	$('div [class="item entry"]').each(function(i, elem) {
      		summary = $(this).children('div [class="itemtext"]').text();
      		id = $(this).attr('id').substr(5);
      		header = $(this).children('div [class="itemhead"]').children('h3').children('a').first().text();
      		picture = $(this).children('div [class="itemtext"]').find('img').attr('src');
      		dbSave(id ,header, picture, summary, post);
  		});
	});
	res.render('index', { title: 'Parsing s13 Express'});
});

module.exports = router;
