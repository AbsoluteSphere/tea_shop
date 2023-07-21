// 用require包含进来下载的mysql
const mysql = require('mysql')
let connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'root',
  database:'vue_store',
  // 注意不写port默认是3306,,我的mysql端口是33306
  port: '33306'
})
// 通过module抛出
module.exports = connection