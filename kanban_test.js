var http = require('http')
var url = require('url')
var ejs = require('ejs')


const sql = require('mssql') //声明插件

// mes数据库信息
const config_mes = {
    user: 'sa',
    password: 'Txts@1911',
    server: '192.168.8.11',
    database: 'DB_JTMES',
    pool: {
        min: 0,
        max: 20,
        idleTimeoutMillis: 3000
    }
}

async function test_hege() {
    try {
        await sql.connect(config_mes)
        let test = await sql.query`select FF.prd_NO,FF.NAME,jk_qty,qty_lost,qty_all,CONVERT(VARCHAR(20),jk_qty/qty_all*100)+'%' AS hgl from 
        (select prd_no,name,jk_qty,qty_lost,jk_qty+qty_lost as qty_all from (
        select prd_no,name,jk_qty ,isnull(qty,0) as qty_lost from 
        (SELECT AA.PRD_NO,BB.NAME,AA.JK_QTY FROM 
        (select prd_no,sum(qty) as jk_qty from jm_mm_tf a where  a.hpdate>'2020-06-30' and a.hpdate<'2020-08-01'  and  wh='B04' group by prd_NO) AA,
        JM_PRDT BB WHERE AA.PRD_NO=BB.PRD_NO) CC left join pjbhg DD on cc.name=dd.prd_name) EE) FF`
        return test.recordset
    }
    catch (err) {
        console.log(err)
        console.log("合格率报错了")
    }
}

// 连接器车间和温控器车间的折线数据
async function wenkong_lianjie_line() {
    try {
        await sql.connect(config_mes)
        let test = await sql.query`select  a.op_dd,sum(a.qty_cur) as qty_cur from jm_job_rec a left join  jm_mo_mf b on a.mo_no=b.sid  where b.dep in ('B1102','B1101') and DateDiff(dd,a.op_dd,getdate())<=7  group by a.op_dd order by a.op_dd`
        return test.recordset
    }
    catch (err) {
        console.log("报错了")
    }
}



var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.set('views', __dirname + '/views');
app.use(express.static('public'));
// 用于跨域请求
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/wenkong_lianjie_line', async function (req, res) {
    await wenkong_lianjie_line().then(data => {
        res.json({ 'data': data, 'length': data.length })
    })
});


app.get('/hege', async function (req, res) {
    let page = req.query.page
    let size = req.query.size
    await test_hege().then(data => {
        // let data_list = data.slice((size * page - size), size * page)
        console.log(data)
        res.json({ 'data': data })
    })
    // res({ 'data': data_list, 'length': data.length })
});

app.listen(4008);