/**
 * Created by 2171490102016 on 2017/4/24.
 */
var mongoose = require('mongoose');

//schema：模式
//建立一个存储的字段模板
var postSchema = new mongoose.Schema({
	"username": String,
	"datetime": String,
	"content": String
});
//索引：查询是速度快，且插入的数据不能有重复数据，但是插入的速度会比没有设置索引慢
postSchema.index({ "username": 1});

//model
var Post = mongoose.model("Post",postSchema);

module.exports = Post;