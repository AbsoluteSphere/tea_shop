//验证数据库中的用户相关内容
const User = {
	//查询用户手机号
	queryUserTel( option ){
		return 'select * from user where tel = '+option.userTel+'';
	},
	//查询密码
	queryUserPwd( option ){
		return 'select * from user where (tel = '+option.userTel+') and pwd = '+option.userPwd+'';
	},
	// 新增用户
	insertData(option){
		let userTel = option.userTel
		let userPwd = option.userPwd || '666666'

		// 引入token包
		let jwt = require('jsonwebtoken')
		// 用户信息
		let payload = {tel:userTel}
		// 口令
		let secret = 'vue-shop'
		// 当用户登录的时候，就把用户信息在服务端通过jsonwebtoken进行加密生成token
		let token = jwt.sign(payload, secret)

		return 'insert into user (tel,pwd,imgUrl,nickName,token) values ("'+userTel+'","'+userPwd+'","./images/user.jpeg","用户'+userTel+'","'+token+'")'
	}
}
exports = module.exports = User;