/**
 * Created by Danny on 2015/9/29 14:50.
 */
var mongoose = require('mongoose');

//schema
var userSchema = new mongoose.Schema({
    "name" : String,
    "age" : Number,
    "sex" : String,
});
//索引
userSchema.index({ "sid": 1});

//model
var User = mongoose.model("User",userSchema);

module.exports = User;