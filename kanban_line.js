var http = require('http')
var url = require('url')
var ejs = require('ejs')


const sql = require('mssql') //声明插件

// mes数据库信息
const config_mes = {
    user:'sa',
    password: 'Txts@1911',
    server: '192.168.8.11', 
    database: 'DB_JTMES',
}
// 进度仓数据sql语句  
async function line(){
    try{
        await sql.connect(config_mes)
        let test = await sql.query`select  a.op_dd,b.dep,e.name,sum(a.qty_cur) as qty_cur from jm_job_rec a left join  jm_mo_mf b on a.mo_no=b.sid left join jm_dept e on b.dep=e.dep where b.dep='B13' and DateDiff(dd,a.op_dd,getdate())<=7  group by a.op_dd,b.dep,e.name order by a.op_dd`
        return test.recordset
    }
    catch(err){
        console.log("报错了")
    }
}


var express = require("express");
var app = express();
app.set("view engine","ejs");
app.set('views', __dirname + '/views');
app.use(express.static('public'));
// 用于跨域请求
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/line', async function(req, res) {
    await line().then( data => {
    console.log(data)
    res.json({'data':data,'length': data.length})
    })
  });



app.listen(4002);