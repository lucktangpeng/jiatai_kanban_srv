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

// 配件仓表格数据
async function progress(){
    try{
        await sql.connect(config_mes)
        let test = await sql.query`select a.mo_no,f.name as jgzy,a.prd_no,c.name,d.qty,d.qty_fin,sum(a.qty_cur) as qty_cur
        from jm_job_rec a(nolock) left join jm_resource f on a.rs_no=f.rs_no left join jm_worker g on a.wk_no=g.wk_no left join jm_job d on a.mo_no=d.sid and a.jb_no=d.jb_no,jm_mo_mf b(nolock) left join jm_prdt c on b.prd_no=c.prd_no left join jm_dept e on b.dep=e.dep
        where a.mo_no=b.sid and DateDiff(dd,a.op_dd,getdate())<=0 and ( b.dep='B13' or b.dep='') and  a.qty_cur>0  
        group by a.mo_no,f.name,a.prd_no,c.name,d.qty,d.qty_fin`
        return test.recordset
    }
    catch(err){
        console.log("报错了")
    }
}
// 配件仓折线图数据
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

async function test(){
    try{
        await sql.connect(config_mes)
        let test = await sql.query`select a.mo_no,f.name as jgzy,a.prd_no,c.name,d.qty,d.qty_fin,sum(a.qty_cur) as qty_cur
        from jm_job_rec a(nolock) left join jm_resource f on a.rs_no=f.rs_no left join jm_worker g on a.wk_no=g.wk_no left join jm_job d on a.mo_no=d.sid and a.jb_no=d.jb_no,jm_mo_mf b(nolock) left join jm_prdt c on b.prd_no=c.prd_no left join jm_dept e on b.dep=e.dep
        where a.mo_no=b.sid and DateDiff(dd,a.op_dd,getdate())<=0 and ( b.dep='B12' or b.dep='') and  a.qty_cur>0  
        group by a.mo_no,f.name,a.prd_no,c.name,d.qty,d.qty_fin`
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
// 用于配件仓的表格数据
app.get('/progress', async function(req, res) {
    let page = req.query.page
    let size = req.query.size
    await progress().then( data => {
    let data_list = data.slice((size * page - size),size * page)
    console.log(data)
    res.json({'data':data_list,'length': data.length})
    })
  });
 // 用于配件仓的折线图数据
 app.get('/progress_line', async function(req, res) {
    await line().then( data => {
    res.json({'data':data_list,'length': data.length})
    })
  });



app.listen(4001);