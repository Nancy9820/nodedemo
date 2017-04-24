/**
 * Created by 2171490102016 on 2017/4/20.
 */
var crypto = require("crypto");
module.exports = function(mingma){
	//设置加密公式
	var mima = mingma+"ruirui";
	var md5 = crypto.createHash('md5');
	var password = md5.update(mima).digest('base64');
	return password;
}
