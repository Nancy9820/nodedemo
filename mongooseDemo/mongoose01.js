/**
 * Created by 2171490102016 on 2017/4/20.
 */
var db = require("./module/db.js");
var User = require("./module/Users.js");
User.create({"name":"小李","age":20,"sex":"女"},function(){
	console.log("插入成功");
	});

////执行插入
//exports.doadd = function(req,res,next){
//	//存储数据
//	//url是   /doadd?sid=10000&name=小红&sex=男&kechengs=100&kechengs=102
//	//req.query就是对象
//	//{name: 小红 ,  sex:男，  kechengs:[100,102]}
//	Student.create(req.query,function(){
//		console.log("插入成功");
//		//在课程中添加此人
//		Kecheng.tianjiaxuesheng(req.query.Kechengs,req.query.sid,function(){
//			res.send("插入成功");
//		});
//	});
//}
//
////修改
//exports.edit = function(req,res,next) {
//	//显示修改界面
//	var sid = parseInt(req.params["sid"]);
//
//	Student.findOne({"sid": sid}, function (err, result) {
//		if(err || !result){
//			res.send("错误");
//			return;
//		}
//		Kecheng.find({},function(err,result2){
//			res.render("edit", {
//				"student": result,
//				"quanbukecheng" : result2
//			});
//		});
//	});
//}
//
////执行修改
//exports.doedit = function(req,res,next) {
//	//执行修改
//	//要改的学生sid
//	var sid = parseInt(req.params["sid"]);
//	Student.update({"sid":sid},req.query,function(){
//		res.send("修改成功");
//	});
//}
//
//exports.remove = function(req,res,next) {
//	//执行修改
//	//要改的学生sid
//	var sid = parseInt(req.params["sid"]);
//	Student.remove({"sid":sid},function(){
//		res.send("删除成功");
//	});
//}