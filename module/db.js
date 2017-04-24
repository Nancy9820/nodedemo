var mongoose = require('mongoose');
//配置连接数据库
//banjishuoshuo：为数据库名称
mongoose.connect('mongodb://localhost:27017/banjishuoshuo');

var db = mongoose.connection;
db.once('open', function (callback) {
    console.log("数据库成功打开");
});

module.exports = db;