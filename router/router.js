/**
 * Created by 2171490102016 on 2017/4/20.
 */
var db = require("../module/db.js");
var User = require("../module/Users.js");
var Post = require("../module/Post.js");
//设置加密
var md5 = require("../module/md5.js");
//设置时间格式
var sd = require('silly-datetime');
// 用于表单提交
var formidable = require("formidable");

var path = require("path");
var fs = require("fs");
var gm = require('gm');

exports.showIndex = function (req, res, next) {
    // 设置session
    if (req.session.login == "1") {
        // 记录在session中的login状态为1，则证明这个请求处于登录状态
        var username = req.session.username;
        var login = true;
        var avatar = "moren.jpg";
        // 如果已经登录，则要显示登录着的信息在index页面上
        User.findOne({ "username": username }, function (findErr, findRes) {
            //console.log(findRes);
            if (findErr) {
                //	查询出错
                console.log("[showIndex]:User findOne:" + findErr.message);
                res.send("404");
            }
            else {

                res.render("index", {
                    "login": login,
                    "username": username,
                    "active": "首页",
                     "avatar": findRes.avatar    //登录人的头像
                });
            }
        })
    }
    else {
        //没有登陆
        var username = "";  //制定一个空用户名
        var login = false;
        res.render("index", {
            "username": username,
            "login": login,
            "active": "首页",
        });
    }

}
exports.showRegist = function (req, res, next) {
    res.render("regist", {
        "login": req.session.login == "1" ? true : false,
        "username": req.session.login == "1" ? req.session.username : "",
        "active": "注册"
    });
}
exports.doRegist = function (req, res, next) {
    // 得到用户填写的内容
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        // 得到表单数据
        var username = fields.username;
        var password = fields.password;

        var sd = require('silly-datetime');
        var createtime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
        //	密码md5技术加密
        var jiami = md5(password);
        //	插入逻辑
        //	判断数据库中该账号是否已经被注册
        //	被注册：返回该用户名已经被注册
        //	未被注册：执行插入操作
        //-2:系统错误；-1：该用户已注册；0：注册成功
        User.findOne({ "username": username }, function (findErr, findRes) {
            //console.log(findRes);
            if (findErr) {
                //	查询出错
                console.log("[doRegist]:User findOne:" + findErr.message);
                res.send("-2");
            }
            else if (!findRes) {

                //	未查询到用户，执行插入操作
                User.create({ "username": username, "password": jiami, "createtime": createtime,"avatar": "moren.jpg" }, function (createErr, createRes) {
                    if (createErr) {
                        //	插入出错
                        console.log("[doRegist]:User create:" + createErr.message);
                        res.send("-2");
                        return;
                    }
                    req.session.login = "1";
                    req.session.username = username;
                    res.send("0");
                });
            }
            else {
                res.send("-1");
            }
        })
    })
}
exports.showLogin = function (req, res, next) {
    res.render("login", {
        "login": req.session.login == "1" ? true : false,
        "username": req.session.login == "1" ? req.session.username : "",
        "active": "登陆"
    });
}
exports.doLogin = function (req, res, next) {
    //得到用户表单
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        //得到表单之后做的事情
        var username = fields.username;
        var password = fields.password;
        var jiamihou = md5(password);
        //查询数据库，看看有没有个这个人
        User.findOne({ "username": username }, function (err, result) {
            if (err) {
                res.send("-5");
                return;
            }
            //没有这个人
            if (!result) {
                res.send("-1"); //用户名不存在
                return;
            }
            //有的话，进一步看看这个人的密码是否匹配
            if (jiamihou == result.password) {
                req.session.login = "1";
                req.session.username = username;
                res.send("1");  //登陆成功
                return;
            } else {
                res.send("-2");  //密码错误
                return;
            }
        });
    });
}
//设置头像页面，必须保证此时是登陆状态
exports.showSetavatar = function (req, res, next) {
    //必须保证登陆
    if (req.session.login != "1") {
        res.end("非法闯入，这个页面要求登陆！");
        return;
    }
    res.render("setavatar", {
        "login": true,
        "username": req.session.username || "小花花",
        "active": "设置个人资料"
    });
};
//设置头像
//设置头像
exports.dosetavatar = function (req, res, next) {
    //必须保证登陆
    if (req.session.login != "1") {
        res.end("非法闯入，这个页面要求登陆！");
        return;
    }

    var form = new formidable.IncomingForm();
    form.uploadDir = path.normalize(__dirname + "/../avatar");
    form.parse(req, function (err, fields, files) {
        //console.log(files);
        var oldpath = files.touxiang.path;
        var newpath = path.normalize(__dirname + "/../avatar/") + "/" + req.session.username + ".jpg";

        fs.rename(oldpath, newpath, function (err) {
            if (err) {
                res.send("失败");
                return;
            }
            req.session.avatar = req.session.username + ".jpg";
            //跳转到切的业务
            res.redirect("/cut");
        });
    });
}
//显示切图页面
exports.showcut = function (req, res) {
    //必须保证登陆
    if (req.session.login != "1") {
        res.end("非法闯入，这个页面要求登陆！");
        return;
    }
    res.render("cut", {
        avatar: req.session.avatar,
        imgpath: "../avatar/"
    })
};
//执行切图
exports.docut = function (req, res, next) {
	//必须保证登陆
	if (req.session.login != "1") {
		res.end("非法闯入，这个页面要求登陆！");
		return;
	}
	//这个页面接收几个GET请求参数
	//w、h、x、y
	var filename = req.session.avatar;
	var w = req.query.w;
	var h = req.query.h;
	var x = req.query.x;
	var y = req.query.y;

	gm("./avatar/" + filename)
		.crop(w, h, x, y)
		.resize(100, 100, "!")
		.write("./avatar/" + filename, function (err) {
			if (err) {
				res.send("-1");
				return;
			}
			//更改数据库当前用户的avatar这个值
			User.update( {"username": req.session.username},{"avatar": req.session.avatar},function(err){
				res.send("1");
			})
		});
}
//发表说说
exports.doPost = function (req, res, next) {
    //必须保证登陆
    if (req.session.login != "1") {
        res.end("非法闯入，这个页面要求登陆！");
        return;
    }
    //用户名
    var username = req.session.username;
    var createtime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    //得到用户填写的东西
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        //得到表单之后做的事情
        var content = fields.content;

        //现在可以证明，用户名没有被占用
        Post.create({
            "username": username,
            "datetime": createtime,
            "content": content
        }, function (createErr, createRes) {
            if (createErr) {
                res.send("-3"); //服务器错误
                return;
            }
            res.send("1"); //注册成功
        });
    });
};
//列出所有说说，有分页功能
exports.getAllShuoshuo = function(req,res,next){
    //这个页面接收一个参数，页面
    var page = parseInt(req.query.page);
    //Post.find().skip(0).limit(2).sort({"-datetime":1}).exec(function(err,result){
    //    console.log(result);
    //    res.json(result);
    //})
    Post.find().sort({"-datetime":1}).exec(function(err,result){
        console.log(result);
        res.json(result);
    })
};
//列出某个用户的信息
exports.getuserinfo = function(req,res,next){
    //这个页面接收一个参数，页面
    var username = req.query.username;
    User.find({"username":username},function(err,result){
        if(err || result.length == 0){
            res.json("");
            return;
        }
        var obj = {
            "username" : result[0].username,
            "avatar" : result[0].avatar,
            "_id" : result[0]._id,
        };
        res.json(obj);
    });
};
//说说总数
exports.getshuoshuoamount = function(req,res,next){
    Post.count({},function(count){
        res.send(count.toString());
    });
};
//显示某一个用户的个人主页
exports.showUser = function(req,res,next){
    var user = req.params["user"];
    Post.find({"username":user},function(err,result){
        User.find({"username":user},function(err,result2){
            res.render("user",{
                "login": req.session.login == "1" ? true : false,
                "username": req.session.login == "1" ? req.session.username : "",
                "user" : user,
                "active" : "我的说说",
                "cirenshuoshuo" : result,
                "cirentouxiang" : result2[0].avatar
            });
        });
    });

}

//显示所有注册用户
exports.showuserlist = function(req,res,next){
    User.find({},function(err,result){
        res.render("userlist",{
            "login": req.session.login == "1" ? true : false,
            "username": req.session.login == "1" ? req.session.username : "",
            "active" : "成员列表",
            "suoyouchengyuan" : result
        });
    });
}






