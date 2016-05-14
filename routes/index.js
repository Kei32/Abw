var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request = require("request");
var cheerio = require("cheerio");
var iconv = require('iconv-lite');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Parsing Abw.by Express' });
});

router.get('/update', function(req, res, next) {

	var url = "http://www.abw.by/";
 
	request({url:url, encoding:'binary'}, function (error, res, body) {
    	if (error) {
        	console.log('Couldn’t get page because of error: ' + error);
      		return;
    	}
    	var $ = cheerio.load(iconv.encode(iconv.decode(new Buffer(body,'binary'),'win1251'),'utf8'));

		var post = mongoose.model('post');

    	function dbSave(id ,header, picture, summary, post)
    	{
      		var urlNews = "http://www.abw.by/news/"+ id;
      		request({url:urlNews, encoding:'binary'}, function (error, res, body) {
        		if (error) {
            		console.log('Couldn’t get page because of error: ' + error);
            		return;
        		}
        
       			var fullСontent = "";
        		var $ = cheerio.load(iconv.encode(iconv.decode(new Buffer(body,'binary'),'win1251'),'utf8'));
       			$('[class="news_text_t"]').children('p').each(function(i, elem) {
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

    	$('article').each(function(i, elem) {
      		summary = $(this).children('div [class="day_news_item_text"]').children('div [class="day_news_item_announce"]').children('a').text();
      		id = $(this).children('div [class="day_news_item_img"]').children('a').attr('href');
      		id = id.substr(6, id.length-7);
      		header = $(this).children('div [class="day_news_item_text"]').children('div [class="day_news_item_title"]').children('h3').children('a').text();
      		picture = $(this).children('div [class="day_news_item_img"]').children('a').children('img').attr('src');
      		dbSave(id ,header, picture, summary, post);
  		});
	});
	res.render('index', { title: 'Parsing Abw.by Express'});
});

module.exports = router;
