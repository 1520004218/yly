var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var DB_STR = "mongodb://localhost:27017/tn_blog";

/* GET home page. */
router.get('/', function(req, res, next) {
    //连接数据库，查询cats集合，获取其内容
    MongoClient.connect(DB_STR,function(err,db) {
        if (err) {
            res.send(err);
            return;
        }
        var c = db.collection('cats');
        c.find().toArray(function(err,docs){
            if (err) {
                res.send(err);
                return;
            }
            //在渲染视图页面的时候，传递到视图页面中
            res.render('admin/category_list',{data:docs}); //data的内容是一个对象数组,数组中包含若干个对象
        });
    });
});

router.get('/add', function(req, res, next) {
    res.render('admin/category_add');
});

router.post('/add', function(req, res) {

    var title = req.body.title;
    var sort = req.body.sort;

    MongoClient.connect(DB_STR,function (err, db) {
        if (err){
            res.send(err);
            return;
        }
        var c = db.collection('cats');
        c.insert({title:title,sort:sort},function (err, result) {
            if (err) {
                res.send(err);
            } else {
                //插入成功
                res.send('添加分类成功 <a href="/admin/cats">查看列表</a>');
            }
        });
    });


});

router.get('/edit', function(req, res, next) {
    var id = req.query.id;
    MongoClient.connect(DB_STR,function(err,db) {
        if (err) {
            res.send(err);
            return;
        }
        var c = db.collection('cats');
        c.find({_id:ObjectId(id)}).toArray(function(err,docs){
            if (err) {
                res.send(err);
                return;
            }
            res.render('admin/category_edit',{data:docs[0]});
        });
    });
});

router.post('/edit', function(req, res, next) {
    var title = req.body.title;
    var sort = req.body.sort;
    var id = req.body.id;

    MongoClient.connect(DB_STR,function (err, db) {
        if (err) {
            res.send(err);
            return;
        }
        var c = db.collection('cats');
        c.update({_id: ObjectId(id)}, {$set: {"title": title, "sort": sort}}, function (err, result) {
            if (err) {
                res.send(err);
            } else {
                //插入成功
                res.send('更新成功 <a href="/admin/cats">返回列表</a>');
            }
        });
    });
});


module.exports = router;
