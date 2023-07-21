var express = require('express');
var router = express.Router();
// 加载sql.js
var connection = require('../db/sql.js')
var user = require('../db/userSql.js')
// 引入腾讯云短信
var QcloudSms = require("qcloudsms_js")
let jwt = require('jsonwebtoken');


/* GET home page. */
router.get('/', function(req, res, next){
  res.render('index', { title: 'Express' });
});

// 加入购物车
router.post('/api/addCart',function(req,res,next){
  let token = req.headers.token;
  let tel = jwt.decode(token);
  console.log(tel);
  res.send({
      data:{a:1}
  })
})

//修改密码
router.post('/api/recovery',function(req,res,next){
	let params = {
		userTel : req.body.phone,
		userPwd : req.body.pwd
	}
	//查询用户是否存在
	connection.query( user.queryUserTel( params ) ,function(error,results){
		//某一条记录数id
		let id = results[0].id;
		let pwd = results[0].pwd;
		console.log(  `update user set pwd = replace(pwd,${pwd},${params.userPwd}) where id = ${id}` )
		connection.query(`update user set pwd = replace(pwd,'${pwd}','${params.userPwd}') where id = ${id}`,function(err,result){
			res.send({
				code:200,
				data:{
					success:true,
					msg:'修改成功'
				}
			})
		})
	})
})

// 注册用户
router.post('/api/register',function(req,res,next){
  // 接收前端传来的phone
  let params = {
    userTel:req.body.phone,
    userPwd:req.body.pwd
  }
  // 查询手机号是否已注册
  connection.query(user.queryUserTel(params),function(error,results){
    if(error) throw error
    if(results.length > 0){
      // 手机号已注册
      res.send({
        code:200,
        data:{
          success:true,
          msg:'该手机号已注册',
          data:results[0]
        }
      })
    }else{
      // 不存在，新增一条数据
      connection.query(user.insertData(params),function(err,result){
        if(err) throw err
        connection.query(user.queryUserTel(params),function(e,r){
          if(e) throw e
          res.send({
            code:200,
            data:{
              success:true,
              msg:'注册成功',
              data:r[0]
            }
          })
        })
      })
    }
  })
})

// 手机验证码登录 / 查询用户是否存在
router.post('/api/codeLogin',function(req,res,next){
  // 接收前端传来的phone
  let params = {
    userTel:req.body.phone
  }
  // 查询用户是否存在
  connection.query(user.queryUserTel(params),function(error,results){
    if(error) throw error
    if(results.length > 0){
      // 用户存在
      res.send({
        code:200,
        data:{
          success:true,
          msg:'用户存在',
          data:results[0]
        }
      })
    }else{
      // 不存在，返回提示注册
      res.send({
        code:200,
        data:{
          success:false,
          msg:'用户不存在，请注册',
          // data:results[0]+'用户不存在'
        }
      })
    }
  })
})

// 发送验证码接口
router.post('/api/code',function(req,res,next){
  
  // 接收前端传来的手机号
  let tel = req.body.phone

  // 群发短信
  // 短信应用SDK AppID
  var appid = 1400187558;  // SDK AppID是1400开头

  // 短信应用SDK AppKey
  var appkey = "dc9dc3391896235ddc2325685047edc7";

  // 需要发送短信的手机号码
  var phoneNumbers = [tel];

  // 短信模板ID，需要在短信应用中申请
  var templateId = 285590;  // NOTE: 这里的模板ID`7839`只是一个示例，真实的模板ID需要在短信控制台中申请

  // 签名
  var smsSign = "三人行慕课";  // NOTE: 这里的签名只是示例，请使用真实的已申请的签名, 签名参数使用的是`签名内容`，而不是`签名ID`

  // 实例化QcloudSms
  var qcloudsms = QcloudSms(appid, appkey);

  // 设置请求回调处理, 这里只是演示，用户需要自定义相应处理回调
  function callback(err, ress, resData) {
    if (err) {
        console.log("err: ", err);
    } else {
        res.send({
          code:200,
          data:{
            success:true,
            data:ress.req.body.params[0]
          }
        })
    }
  }

  // 单发短信
  var ssender = qcloudsms.SmsSingleSender();
  //这个变量：params 就是往手机上，发送的短信
  var params = [  Math.floor( Math.random()*(9999-1000))+1000   ];
	ssender.sendWithParam(86, phoneNumbers[0], templateId,
	params, smsSign, "", "", callback);  // 签名参数不能为空串
})

// 密码登录接口
router.post('/api/pwdLogin',function(req,res,next){
  // 后端接收前端传过来的值
  let params = {
    // req.body用于解析POST请求的数据
    userTel: req.body.userTel,
    userPwd: req.body.userPwd
  }
  // 查询用户手机号是否存在
  connection.query(user.queryUserTel(params),function(error,results){
    //手机号存在 
		if( results.length > 0 ){
			connection.query( user.queryUserPwd( params ) ,function(err,result){
				if(  result.length > 0 ){
					//手机号和密码都对
					res.send({
						code:200,
						data:{
							success:true,
							msg:'登录成功',
							data:result[0]
						}
					})
				}else{
					//密码不对
					res.send({
						code:302,
						data:{
							success:false,
							msg:'密码不正确'
						}
					})
				}
			})
			
		}else{
			//不存在
			res.send({
				code:301,
				data:{
					success:false,
					msg:'用户不存在'
				}
			})
		}
  })
})

// 查询商品id的数据
router.get('/api/goods/id',function(req,res,next){
  // 获取前端传来的id
  let id = req.query.id
  connection.query('select * from goods_list where id='+id+'',function(error,results){
    if(error) throw error
    // res.json或res.send都可
    res.send({
      code:0,
      // 后端给前端返回一个数组
      data:results[0]
    })
  })
})

// 分类的接口
router.get('/api/goods/list',function(req,res,next){
  res.send({
    code:0,
    data:[
      // 1一级:左侧导航栏
      {
        id:0,
        name:'推荐',
        data:[
          // 二级:右侧中间标题
          {
            id:0,
            name:'推荐',
            list:[
              // 三级:右侧具体内容
              {
                id:0,
                name:'铁观音',
                imgUrl:'./images/tgy.jfif'
              },
              {
                id:1,
                name:'精品茶具',
                imgUrl:'./images/like.jpeg'
              },
              {
                id:2,
                name:'绿茶',
                imgUrl:'./images/lc.jpeg'
              },
              {
                id:3,
                name:'西湖龙井',
                imgUrl:'./images/goods-list1.jpeg'
              },
              {
                id:4,
                name:'大红袍',
                imgUrl:'./images/dhp.jfif'
              },
              {
                id:5,
                name:'品茶礼盒',
                imgUrl:'./images/goods1.jpg'
              },
            ]
          }
        ]
      },
      // 2一级:左侧导航栏
      {
        id:1,
        name:'大红袍',
        data:[
          // 二级:右侧中间标题
          {
            id:1,
            name:'大红袍',
            list:[
              // 三级:右侧具体内容
              {
                id:0,
                name:'大红袍乌龙茶',
                imgUrl:'./images/dhplike1.jpg'
              },
              {
                id:1,
                name:'八马茶业',
                imgUrl:'./images/dhplike2.jpg'
              },
              {
                id:2,
                name:'闽茶府大红袍茶叶',
                imgUrl:'./images/dhplike3.jpg'
              },
              {
                id:3,
                name:'中古御品',
                imgUrl:'./images/dhplike4.jpg'
              },
              {
                id:4,
                name:'醉然香',
                imgUrl:'./images/dhplike1.jpg'
              },
              {
                id:5,
                name:'乌龙茶大红袍',
                imgUrl:'./images/dhplike3.jpg'
              },
            ]
          }
        ]
      },
      // 3一级:左侧导航栏
      {
        id:2,
        name:'铁观音',
        data:[
          // 二级:右侧中间标题
          {
            id:0,
            name:'铁观音',
            list:[
              // 三级:右侧具体内容
              {
                id:0,
                name:'佰儒',
                imgUrl:'./images/tgylike1.jpg'
              },
              {
                id:1,
                name:'闽茶府',
                imgUrl:'./images/tgylike2.jpg'
              },
              {
                id:2,
                name:'五大茗茶',
                imgUrl:'./images/tgylike3.jpg'
              },
              {
                id:3,
                name:'八马茶业',
                imgUrl:'./images/tgylike4.jpg'
              },
              {
                id:4,
                name:'芯轩',
                imgUrl:'./images/tgylike1.jpg'
              },
              {
                id:5,
                name:'特级新茶',
                imgUrl:'./images/tgylike2.jpg'
              },
            ]
          }
        ]
      },
      // 4一级:左侧导航栏
      {
        id:3,
        name:'绿茶',
        data:[
          // 二级:右侧中间标题
          {
            id:0,
            name:'绿茶',
            list:[
              // 三级:右侧具体内容
              {
                id:0,
                name:'龙井',
                imgUrl:'./images/lclike1.jpg'
              },
              {
                id:1,
                name:'碧螺春',
                imgUrl:'./images/lclike2.jpg'
              },
              {
                id:2,
                name:'雀舌',
                imgUrl:'./images/lclike3.jpg'
              },
              {
                id:3,
                name:'安吉白茶',
                imgUrl:'./images/lclike4.jpg'
              },
              {
                id:4,
                name:'六安瓜片',
                imgUrl:'./images/lclike1.jpg'
              },
              {
                id:5,
                name:'毛尖',
                imgUrl:'./images/lclike2.jpg'
              },
            ]
          }
        ]
      },
      // 5一级:左侧导航栏
      {
        id:4,
        name:'普洱',
        data:[
          // 二级:右侧中间标题
          {
            id:0,
            name:'普洱',
            list:[
              // 三级:右侧具体内容
              {
                id:0,
                name:'醉然香',
                imgUrl:'./images/puerlike1.jpg'
              },
              {
                id:1,
                name:'茶人岭茶叶',
                imgUrl:'./images/puerlike2.jpg'
              },
              {
                id:2,
                name:'新益号茶叶',
                imgUrl:'./images/puerlike3.jpg'
              },
              {
                id:3,
                name:'张一元茶叶',
                imgUrl:'./images/puerlike4.jpg'
              },
              {
                id:4,
                name:'普洱茶叶',
                imgUrl:'./images/puerlike1.jpg'
              },
              {
                id:5,
                name:'云南普洱',
                imgUrl:'./images/puerlike2.jpg'
              },
            ]
          }
        ]
      },
      // 6一级:左侧导航栏
      {
        id:5,
        name:'茶具',
        data:[
          // 二级:右侧中间标题
          {
            id:0,
            name:'茶具',
            list:[
              // 三级:右侧具体内容
              {
                id:0,
                name:'功夫茶具',
                imgUrl:'./images/chajulike1.jpg'
              },
              {
                id:1,
                name:'静瓷斋',
                imgUrl:'./images/chajulike2.jpg'
              },
              {
                id:2,
                name:'宏冠茶具',
                imgUrl:'./images/chajulike3.jpg'
              },
              {
                id:3,
                name:'宅轻松茶具套装',
                imgUrl:'./images/chajulike4.jpg'
              },
              {
                id:4,
                name:'京器茶具套装',
                imgUrl:'./images/chajulike1.jpg'
              },
              {
                id:5,
                name:'德化白瓷羊脂玉功夫茶具',
                imgUrl:'./images/chajulike2.jpg'
              },
            ]
          }
        ]
      },
      // 7一级:左侧导航栏
      {
        id:6,
        name:'花茶',
        data:[
          // 二级:右侧中间标题
          {
            id:0,
            name:'花茶',
            list:[
              // 三级:右侧具体内容
              {
                id:0,
                name:'春上早茉莉花茶',
                imgUrl:'./images/huachalike1.jpg'
              },
              {
                id:1,
                name:'忆江南 养生茶',
                imgUrl:'./images/huachalike2.jpg'
              },
              {
                id:2,
                name:'吴裕泰茶叶 茉莉花茶',
                imgUrl:'./images/huachalike3.jpg'
              },
              {
                id:3,
                name:'特级茉莉花茶龙珠',
                imgUrl:'./images/huachalike4.jpg'
              },
              {
                id:4,
                name:'新茶浓香型茉莉毛尖',
                imgUrl:'./images/huachalike1.jpg'
              },
              {
                id:5,
                name:'红枣桂圆玫瑰枸杞茶',
                imgUrl:'./images/huachalike2.jpg'
              },
            ]
          }
        ]
      }
    ]
  })
})

// 查询商品数据接口
router.get('/api/goods/shopList',function(req,res,next){
  // console.log(req.query.searchName);
  // 前端给后端的数据
  // let searchName = req.query.searchName
  // 拿到升降序
  // req.query是{ searchName(key): '茶'(value), price: 'asc' }
  // 传过来的params：{searchName: this.$route.query.key,  ...this.orderBy即price:asc}
  let [searchName,orderName] = Object.keys(req.query)
  let [name,order] = Object.values(req.query)
  console.log(searchName,name,';',orderName,order);
  // 查询数据库
  connection.query('select * from goods_list where content like "%'+name+'%" order by '+orderName+' '+order+'',function(error,results){
    if(error) throw error
    res.send({
      code:0,
      data:results
    })
  })
})

// 这里是后端接口
// Home里的created()里的axios的url写的啥此处同样
// 这是首页推荐的数据
router.get('/api/index_list/0/data/1', function(req, res, next) {
  res.send({
    code:0,
    data:{
      topBar:[
				{id:0,label:'推荐'},
				{id:1,label:'大红袍'},
				{id:2,label:'铁观音'},
				{id:3,label:'绿茶'},
				{id:4,label:'普洱'},
				{id:5,label:'茶具'},
				{id:6,label:'花茶'},
			],
      data:[
        // 这是swiper
        {
          id:0,
          type:'swiperList',
          data:[
            {id:1,imgUrl:'./images/swiper1.jpeg'},
            {id:2,imgUrl:'./images/swiper2.jpeg'},
            {id:3,imgUrl:'./images/swiper3.jpeg'}
          ]
        },
        // 这是icons
        {
          id:1,
          type:'iconList',
          data:[
            {
              id: 1,
              title: '自饮茶',
              imgUrl: './images/icons1.png'
            },
            {
              id: 2,
              title: '茶具',
              imgUrl: './images/icons2.png'
            },
            {
              id: 3,
              title: '茶礼盒',
              imgUrl: './images/icons3.png'
            },
            {
              id: 4,
              title: '领福利',
              imgUrl: './images/icons4.png'
            },
            {
              id: 5,
              title: '官方验证',
              imgUrl: './images/icons5.png'
            }
          ]
        },
        // 这是爆款推荐
        {
          id:2,
          type:'recommendList',
          data:[
            {
            id: 1,
            name: '龙井1號铁罐250g',
            content: '鲜爽甘醇 口粮首选',
            price: '68',
            imgUrl: './images/recommend.jpeg'
            },
            {
              id: 2,
              name: '龙井1號铁罐250g',
              content: '鲜爽甘醇 口粮首选',
              price: '68',
              imgUrl: './images/recommend.jpeg'
            },
            {
              id: 3,
              name: '龙井1號铁罐250g',
              content: '鲜爽甘醇 口粮首选',
              price: '68',
              imgUrl: './images/recommend.jpeg'
            },
            {
              id: 4,
              name: '龙井1號铁罐250g',
              content: '鲜爽甘醇 口粮首选',
              price: '68',
              imgUrl: './images/recommend.jpeg'
            }
          ]
        },     
        // 猜你喜欢
        {
          id:3,
          type:'likeList',
          data:[
            {
              id: 1,
              imgUrl: './images/like.jpeg',
              name: '茶具套装',
              price: 299
            },
            {
              id: 2,
              imgUrl: './images/dhplike1.jpg',
              name: '八马茶业',
              price: 198
            },
            {
              id: 3,
              imgUrl: './images/dhplike2.jpg',
              name: '醉然香',
              price: 299
            },
            {
              id: 4,
              imgUrl: './images/dhplike3.jpg',
              name: '中谷御品',
              price: 178
            },
            {
              id: 5,
              imgUrl: './images/dhplike4.jpg',
              name: '闽茶府大红袍茶叶',
              price: 168
            },
            {
              id: 6,
              imgUrl: './images/tgylike1.jpg',
              name: '佰儒（BAIRU）',
              price: 218
            },
            {
              id: 7,
              imgUrl: './images/tgylike2.jpg',
              name: '闽茶府 福建铁观音茶叶',
              price: 168
            },
            {
              id: 8,
              imgUrl: './images/tgylike3.jpg',
              name: '八马茶业 五大茗茶茶叶礼盒',
              price: 346
            },
            {
              id: 9,
              imgUrl: './images/tgylike4.jpg',
              name: '芯轩 安溪铁观音茶叶',
              price: 288
            },
            {
              id: 10,
              imgUrl: './images/lclike1.jpg',
              name: '西湖 牌2023新茶预定',
              price: 368
            },
            {
              id: 11,
              imgUrl: './images/lclike2.jpg',
              name: '第一江南茶叶',
              price: 335
            },
            {
              id: 12,
              imgUrl: './images/lclike3.jpg',
              name: '中谷御品 雀舌茶叶绿茶',
              price: 178
            },
            {
              id: 13,
              imgUrl: './images/lclike4.jpg',
              name: '醉然香茶叶 四大绿茶',
              price: 89
            },
            {
              id: 14,
              imgUrl: './images/puerlike1.jpg',
              name: '醉然香 普洱茶叶',
              price: 89
            },
            {
              id: 15,
              imgUrl: './images/puerlike2.jpg',
              name: '茶人岭茶叶云南普洱茶熟茶',
              price: 139
            },
            {
              id: 16,
              imgUrl: './images/puerlike3.jpg',
              name: '新益号糯米香碎银子冰岛普洱茶',
              price: 258
            },
            {
              id: 17,
              imgUrl: './images/puerlike4.jpg',
              name: '张一元茶叶浓香型普洱茶',
              price: 100
            },
            {
              id: 18,
              imgUrl: './images/chajulike1.jpg',
              name: '京器 功夫茶具套装',
              price: 422
            },
            {
              id: 19,
              imgUrl: './images/chajulike2.jpg',
              name: '静瓷斋 德化白瓷羊脂玉功夫茶具套装',
              price: 268
            },
            {
              id: 20,
              imgUrl: './images/chajulike3.jpg',
              name: '鸿冠 描金羊脂玉功夫茶具套装',
              price: 298
            },
            {
              id: 21,
              imgUrl: './images/chajulike4.jpg',
              name: '宅轻松 茶具套装',
              price: 99
            },
            {
              id: 22,
              imgUrl: './images/huachalike1.jpg',
              name: '春上早茉莉花茶',
              price: 39
            },
            {
              id: 23,
              imgUrl: './images/huachalike2.jpg',
              name: '忆江南 养生茶',
              price: 33.9
            },
            {
              id: 24,
              imgUrl: './images/huachalike3.jpg',
              name: '吴裕泰茶叶 茉莉花茶',
              price: 139
            },
            {
              id: 25,
              imgUrl: './images/huachalike4.jpg',
              name: '中谷御品 茶叶 特级茉莉花茶',
              price: 214
            },
            {
              id: 26,
              imgUrl: './images/dhplike3.jpg',
              name: '中谷御品 茶叶乌龙茶大红袍',
              price: 178
            }
          ]
        }
      ]
    }
  })
});

// 这是首页大红袍的数据
router.get('/api/index_list/1/data/1',function(req,res,next){
  res.send({
    code:1,
    data:[
      {
        id:1,
        type:'adList',
        data:[
          {
            id:1,
            imgUrl:'./images/dhp.jpeg'
          },
          {
            id:2,
            imgUrl:'./images/dhp.jfif'
          }
        ]
      },
      // 猜你喜欢
      {
        id:2,
        type:'likeList',
        data:[
          {
            id: 1,
            imgUrl: './images/dhplike1.jpg',
            name: '八马茶业 茶叶 乌龙茶大红袍 武夷山原产 武夷岩茶 茶叶罐装160g 【2023新春绿茶】八马春茶领鲜上市，限时预定享8折，部分低至买2送1！点击前往！',
            price: 198
          },
          {
            id: 2,
            imgUrl: './images/dhplike2.jpg',
            name: '醉然香 茶叶 大红袍乌龙茶正宗武夷原产礼盒装500g 【春茶节】买春茶，逛京东，邂逅春天第一杯茶！1元试饮卢正浩龙井正装！查看',
            price: 299
          },
          {
            id: 3,
            imgUrl: './images/dhplike3.jpg',
            name: '中谷御品 茶叶乌龙茶大红袍 特级岩骨花香正宗武夷高山岩茶叶礼盒200g 【春茶节】买春茶，逛京东，邂逅春天第一杯茶！1元试饮卢正浩龙井正装！查看',
            price: 178
          },
          {
            id: 4,
            imgUrl: './images/dhplike4.jpg',
            name: '闽茶府大红袍茶叶 2022年武夷山岩茶散装 乌龙茶铁罐配手提袋 135克 * 2罐 【传统大红袍，大气桶装】情人节促销，喝杯好茶！',
            price: 168
          }
        ]
      }
    ]
  })
})

// 这是首页铁观音的数据
router.get('/api/index_list/2/data/1',function(req,res,next){
  res.send({
    code:1,
    data:[
      {
        id:1,
        type:'adList',
        data:[
          {
            id:1,
            imgUrl:'./images/tgy.jpeg'
          },
          {
            id:2,
            imgUrl:'./images/tgy.jfif'
          }
        ]
      },
      // 猜你喜欢
      {
        id:2,
        type:'likeList',
        data:[
          {
            id: 1,
            imgUrl: './images/tgylike1.jpg',
            name: '佰儒（BAIRU） 特级新茶安溪铁观音秋茶茶叶清香型兰花香乌龙茶礼盒500g送礼袋',
            price: 218
          },
          {
            id: 2,
            imgUrl: './images/tgylike2.jpg',
            name: '闽茶府 福建铁观音茶叶 正炒正味兰花香 安溪乌龙茶铁观音散装茗茶 铁罐配手提袋 铁观音2罐共500克 【传统正味铁观音，桶装天下茶，耐冲泡兰花香】情人节促销，喝杯好茶！',
            price: 168
          },
          {
            id: 3,
            imgUrl: './images/tgylike3.jpg',
            name: '八马茶业 五大茗茶茶叶礼盒 铁观音普洱金骏眉正山小种福鼎白茶',
            price: 346
          },
          {
            id: 4,
            imgUrl: './images/tgylike4.jpg',
            name: '芯轩 安溪铁观音茶叶 秋茶2022新茶特级高山浓香铁观音礼盒装新茶500g',
            price: 288
          }
        ]
      }
    ]
  })
})

// 这是首页绿茶的数据
router.get('/api/index_list/3/data/1',function(req,res,next){
  res.send({
    code:1,
    data:[
      {
        id:1,
        type:'adList',
        data:[
          {
            id:1,
            imgUrl:'./images/lc.jpeg'
          },
          {
            id:2,
            imgUrl:'./images/lc2.jpeg'
          }
        ]
      },
      // 猜你喜欢
      {
        id:2,
        type:'likeList',
        data:[
          {
            id: 1,
            imgUrl: './images/lclike1.jpg',
            name: '西湖 牌2023新茶预定 明前特级龙井茶【精选】传统纸包 春茶钱塘产区 250g纸包',
            price: 368
          },
          {
            id: 2,
            imgUrl: './images/lclike2.jpg',
            name: '第一江南茶叶 明前绿茶特级龙井杭州龙井茶叶礼盒装250g 【春茶节】买春茶，逛京东，邂逅春天第一杯茶！1元试饮卢正浩龙井正装！查看',
            price: 335
          },
          {
            id: 3,
            imgUrl: './images/lclike3.jpg',
            name: '中谷御品 雀舌茶叶绿茶 新茶特级明前头采贵州湄潭翠芽茶叶礼盒300g 【春茶节】买春茶，逛京东，邂逅春天第一杯茶！1元试饮卢正浩龙井正装！查看',
            price: 178
          },
          {
            id: 4,
            imgUrl: './images/lclike4.jpg',
            name: '醉然香茶叶 四大绿茶2022新茶明前碧螺春龙井云雾绿茶毛尖茶礼盒装500g 【春茶节】买春茶，逛京东，邂逅春天第一杯茶！1元试饮卢正浩龙井正装！查看',
            price: 89
          }
        ]
      }
    ]
  })
})

// 这是首页普洱的数据
router.get('/api/index_list/4/data/1',function(req,res,next){
  res.send({
    code:1,
    data:[
      {
        id:1,
        type:'adList',
        data:[
          {
            id:1,
            imgUrl:'./images/puer1.jfif'
          },
          {
            id:2,
            imgUrl:'./images/puer2.jfif'
          }
        ]
      },
      // 猜你喜欢
      {
        id:2,
        type:'likeList',
        data:[
          {
            id: 1,
            imgUrl: './images/puerlike1.jpg',
            name: '醉然香 普洱茶叶 云南陈香普洱熟茶散茶罐装500g 【春茶节】买春茶，逛京东，邂逅春天第一杯茶！1元试饮卢正浩龙井正装！查看',
            price: 89
          },
          {
            id: 2,
            imgUrl: './images/puerlike2.jpg',
            name: '茶人岭茶叶云南普洱茶熟茶 勐海春茶 陈仓三年罐装普洱200g 【春茶节】买春茶，逛京东，邂逅春天第一杯茶！1元试饮卢正浩龙井正装！查看',
            price: 139
          },
          {
            id: 3,
            imgUrl: './images/puerlike3.jpg',
            name: '新益号糯米香碎银子冰岛普洱茶熟茶茶化石十年以上云南古树茶散茶老茶头 超大份量木桶装 1000克',
            price: 258
          },
          {
            id: 4,
            imgUrl: './images/puerlike4.jpg',
            name: '张一元茶叶浓香型普洱茶一级普洱黑茶熟茶（尚品系列）茶礼送礼罐装150g 【春茶节】买春茶，逛京东，邂逅春天第一杯茶！1元试饮卢正浩龙井正装！查看',
            price: 100
          }
        ]
      }
    ]
  })
})

// 这是首页茶具的数据
router.get('/api/index_list/5/data/1',function(req,res,next){
  res.send({
    code:1,
    data:[
      {
        id:1,
        type:'adList',
        data:[
          {
            id:1,
            imgUrl:'./images/chaju1.jfif'
          },
          {
            id:2,
            imgUrl:'./images/chaju2.jfif'
          }
        ]
      },
      // 猜你喜欢
      {
        id:2,
        type:'likeList',
        data:[
          {
            id: 1,
            imgUrl: './images/chajulike1.jpg',
            name: '京器 功夫茶具套装家用陶瓷茶杯茶壶办公会客约茶台烧水壶套装 一套齐全大号实木茶盘配加湿器全智能煮水创意旋转陶瓷茶具',
            price: 422
          },
          {
            id: 2,
            imgUrl: './images/chajulike2.jpg',
            name: '静瓷斋 德化白瓷羊脂玉功夫茶具套装家用客厅泡茶办公室会客简约茶杯 描金-14头西施壶套装(有言杯) 胎白质坚莹亮润白',
            price: 268
          },
          {
            id: 3,
            imgUrl: './images/chajulike3.jpg',
            name: '鸿冠 描金羊脂玉功夫茶具套装 高档白色玉瓷陶瓷茶道 整套茶壶盖碗茶杯家用送礼办公茶艺 03款：14件羊脂玉（豪华组） 【如遇破损、少件等问题请联系在线客服免费补发】【德化羊脂玉瓷，白若凝脂，如脂似玉，通透温润，描金线条，简约奢华，产品默认纸箱包装，如需礼盒请联系客服。】',
            price: 298
          },
          {
            id: 4,
            imgUrl: './images/chajulike4.jpg',
            name: '宅轻松 茶具套装家用日式办公泡茶盘客厅泡茶台功夫陶瓷茶杯茶壶茶叶罐 宅轻松 茶具套装家用日式办公泡茶盘客厅泡茶台功夫陶瓷茶杯茶壶茶叶罐',
            price: 99
          }
        ]
      }
    ]
  })
})

// 这是首页花茶的数据
router.get('/api/index_list/6/data/1',function(req,res,next){
  res.send({
    code:1,
    data:[
      {
        id:1,
        type:'adList',
        data:[
          {
            id:1,
            imgUrl:'./images/huacha1.jfif'
          },
          {
            id:2,
            imgUrl:'./images/huacha2.jfif'
          }
        ]
      },
      // 猜你喜欢
      {
        id:2,
        type:'likeList',
        data:[
          {
            id: 1,
            imgUrl: './images/huachalike1.jpg',
            name: '春上早茉莉花茶 新茶浓香型茉莉毛尖特级飘雪四川花茶叶礼盒125g 【春茶节】买春茶，逛京东，邂逅春天第一杯茶！1元试饮卢正浩龙井正装！查看',
            price: 39
          },
          {
            id: 2,
            imgUrl: './images/huachalike2.jpg',
            name: '忆江南 养生茶 红枣桂圆玫瑰枸杞茶302g 枸杞泡水喝送女生姨妈元气八宝茶组合花茶叶补五宝花果茶 红枣酥脆，桂圆软糯，杞香四溢，特加玫瑰花冠，花颜悦色，呵护粉嫩，做素颜女神，',
            price: 33.9
          },
          {
            id: 3,
            imgUrl: './images/huachalike3.jpg',
            name: '吴裕泰茶叶 茉莉花茶 茉莉龙珠 60g/罐 中华老字号 【春茶节】买春茶，逛京东，邂逅春天第一杯茶！1元试饮卢正浩龙井正装！查看',
            price: 139
          },
          {
            id: 4,
            imgUrl: './images/huachalike4.jpg',
            name: '中谷御品 茶叶 特级茉莉花茶龙珠 新茶广西横县八窨一提耐泡茶叶礼盒500g 【春茶节】买春茶，逛京东，邂逅春天第一杯茶！1元试饮卢正浩龙井正装！查看',
            price: 214
          }
        ]
      }
    ]
  })
})
module.exports = router;
