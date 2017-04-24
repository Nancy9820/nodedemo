/**
 * Created by Danny on 2015/9/29 14:50.
 */
var mongoose = require('mongoose');

//schema：模式
//建立一个存储的字段模板
var userSchema = new mongoose.Schema({
    "username" : String,
    "password" : String,
    "createtime" : String,
    "avatar":String
});
//索引：查询是速度快，且插入的数据不能有重复数据，但是插入的速度会比没有设置索引慢
userSchema.index({ "username": 1});

//model
var User = mongoose.model("User",userSchema);

module.exports = User;