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

// 配件车间的表格数据
async function progress() {
    try {
        await sql.connect(config_mes)
        let test = await sql.query`select a.mo_no,f.name as jgzy,a.prd_no,c.name,d.qty,d.qty_fin,isnull(h.qty_lost,0) as qty_lost from 
         jm_job_rec a(nolock) left join jm_resource f on a.rs_no=f.rs_no left join 
jm_worker g on a.wk_no=g.wk_no left join jm_job d on a.mo_no=d.sid and a.jb_no=d.jb_no left join jm_job_chk h on h.mo_no=d.sid 

 ,
 jm_mo_mf b(nolock) left join jm_prdt c on b.prd_no=c.prd_no left join jm_dept e on b.dep=e.dep
        where a.mo_no=b.sid  and ( b.dep='B13') and DateDiff(daY,a.op_dd,getdate())<7 and  a.qty_cur>0  and f.name not like'%自动%' AND c.name  not like '%双金%'
        group by a.mo_no,f.name,a.prd_no,c.name,d.qty,d.qty_fin,h.qty_lost 
 union all
 
 select a.mo_no,f.name as jgzy,a.prd_no,c.name,d.qty,d.qty_fin,isnull(h.zf_qty,0) as qty_lost from 
         jm_job_rec a(nolock) left join jm_resource f on a.rs_no=f.rs_no left join 
jm_worker g on a.wk_no=g.wk_no left join jm_job d on a.mo_no=d.sid and a.jb_no=d.jb_no left join jm_job_chk h on h.mo_no=d.sid 
 ,
 jm_mo_mf b(nolock) left join jm_prdt c on b.prd_no=c.prd_no left join jm_dept e on b.dep=e.dep
        where a.mo_no=b.sid  and ( b.dep='B13') and DateDiff(daY,a.op_dd,getdate())<7 and  a.qty_cur>0  and f.name not like'%自动%' AND c.name like '%双金%'
        group by a.mo_no,f.name,a.prd_no,c.name,d.qty,d.qty_fin,h.zf_qty     `
        return test.recordset
    }
    catch (err) {
        console.log("报错了")
    }
}


// 配件车间的折线图的数据
async function progress_line() {
    try {
        await sql.connect(config_mes)
        let test = await sql.query`select  a.op_dd,sum(a.qty_cur) as qty_cur from jm_job_rec a left join  jm_mo_mf b on a.mo_no=b.sid  where b.dep in ('B13') and DateDiff(dd,a.op_dd,getdate())<=7  group by a.op_dd order by a.op_dd`
        return test.recordset
    }
    catch (err) {
        console.log("报错了")
    }
}


// 塑料车间的表格数据
async function zhusu() {
    try {
        await sql.connect(config_mes)
        let test = await sql.query`select a.mo_no,f.name as jgzy,a.prd_no,c.name,d.qty,d.qty_fin,isnull(h.qty_lost,0) as qty_lost
        from jm_job_rec a(nolock) left join jm_resource f on a.rs_no=f.rs_no left join 
jm_worker g on a.wk_no=g.wk_no left join jm_job d on a.mo_no=d.sid and a.jb_no=d.jb_no left join jm_job_chk h on h.mo_no=d.sid and h.jb_no=d.jb_no,jm_mo_mf b(nolock) left join jm_prdt c on b.prd_no=c.prd_no left join jm_dept e on b.dep=e.dep
        where a.mo_no=b.sid  and ( b.dep='B12') and DateDiff(day,a.op_dd,getdate())<7 and  a.qty_cur>0  and f.name not like'%自动%'
        group by a.mo_no,f.name,a.prd_no,c.name,d.qty,d.qty_fin,h.qty_lost`
        return test.recordset
    }
    catch (err) {
        console.log("报错了")
    }
}


// 塑料车间的折线数据
async function zhusu_line() {
    try {
        await sql.connect(config_mes)
        let test = await sql.query`select  a.op_dd,sum(a.qty_cur) as qty_cur from jm_job_rec a left join  jm_mo_mf b on a.mo_no=b.sid  where b.dep in ('B12') and DateDiff(dd,a.op_dd,getdate())<=7  group by a.op_dd order by a.op_dd`
        return test.recordset
    }
    catch (err) {
        console.log("报错了")
    }
}



// 四楼新改的连接器 温控器车间的表格数据
async function wenkongqi() {
    try {
        await sql.connect(config_mes)
        let test = await sql.query`SELECT  HH.name AS jgzy,EE.prd_no,GG.name,FF.qty,EE.qty_fin,EE.qty_lost FROM 
(select prd_no,rs_no,sum(qty_fin) AS QTY_FIN,SUM(qty_LOST) AS QTY_LOST from (
select AA.op_dd,AA.prd_no,AA.rs_no,qty_fin,ISNULL(qty_lost,0) AS QTY_LOST from 
(select op_dd,PRD_NO,sum(QTY_CUR) as qty_fin,RS_NO from JM_JOB_REC WHERE RS_NO IN('B1119009','B1119019','B1119020','B1119033','B11190336','B1119037','B1119038','B1119042','B1119109',
'B1119112','B1119154','B1119158','B1119159','Z3-5S02','Z3ZP-501','Z3ZP-502','Z3ZP-503','Z3ZP-504','Z3ZP-505','Z3ZP-506','Z3ZP-507','Z3ZP-803','Z3ZP-K01','Z3ZP-K02')
AND DateDiff(day,op_dd,getdate())<7 and (usr='B1119033' OR USR='B1119109') group by op_dd,prd_no,rs_no)AA 
left join 
(SELECT OP_DD,PRD_NO,RS_NO,sum(qty_lost) as qty_lost from 
(select OP_DD,PRD_NO,RS_NO,ISNULL(QTY_LOST,0) AS QTY_LOST from ljqb where (USR='B1119033' OR USR='B1119109'))A
group by op_dd,prd_no,rs_no)BB
on aa.op_dd=bb.op_dd and aa.prd_no=bb.prd_no and aa.rs_no=bb.rs_no) DD group by PRD_NO,RS_NO)EE
,
(select prd_no,sum(qty) as qty,rs_no from
(select DISTINCT JB_NO,qty,PRD_NO,rs_no from jm_job where jb_no IN (SELECT jb_no FROM JM_JOB_REC 
WHERE RS_NO IN('B1119009','B1119019','B1119020','B1119033','B11190336','B1119037','B1119038','B1119042','B1119109',
'B1119112','B1119154','B1119158','B1119159','Z3-5S02','Z3ZP-501','Z3ZP-502','Z3ZP-503','Z3ZP-504','Z3ZP-505','Z3ZP-506','Z3ZP-507','Z3ZP-803','Z3ZP-K01','Z3ZP-K02')
 AND DateDiff(day,op_dd,getdate())<7 and (usr='B1119033' OR USR='B1119109')))CC group by prd_no,rs_no)FF,JM_PRDT GG,JM_RESOURCE HH
 where EE.PRD_NO=FF.PRD_NO AND EE.RS_NO=FF.RS_NO AND EE.PRD_NO=GG.PRD_NO AND EE.RS_NO=HH.RS_NO`
        return test.recordset
    }
    catch (err) {
        console.log("报错了")
    }
}


// 温控器车间的折线数据
async function wenkongqi_line() {
    try {
        await sql.connect(config_mes)
        let test = await sql.query`select  a.op_dd,sum(a.qty_cur) as qty_cur from jm_job_rec a left join  jm_mo_mf b on a.mo_no=b.sid  where b.dep in ('B1102') and DateDiff(dd,a.op_dd,getdate())<=7  group by a.op_dd order by a.op_dd`
        return test.recordset
    }
    catch (err) {
        console.log("报错了")
    }
}


// 连接器车间的表格数据
async function lianjieqi() {
    try {
        await sql.connect(config_mes)
        let test = await sql.query`select dd.name as jgzy,aa.prd_no,cc.name,bb.qty,aa.qty_fin,isnull(aa.qty_lost,0) AS qty_lost FROM 
(select A.PRD_NO,A.RS_NO,SUM(A.QTY_FIN) AS QTY_FIN,SUM(B.QTY_LOST) AS QTY_LOST from 
(select prd_no,rs_no,sum(qty_cur) as qty_fin,op_dd from jm_job_rec where rs_no in ('Z3ZP-803','Z3ZP-K02','Z3ZP301','Z3ZPLJQ01',
'Z3ZPLJQ02','Z3ZPLJQ03','Z3ZPLJQ04','Z3ZPLJQ05','Z3ZPLJQ06','Z3ZPLJQ07','Z3ZPLJQ08') and DateDiff(day,op_dd,getdate())<7 group by prd_no,rs_no,op_dd)A
left join 
(select  * from ljqb where DateDiff(day,op_dd,getdate())<15 and usr='B1119087')B on A.prd_no=B.PRD_NO AND A.OP_DD=B.OP_DD AND A.RS_NO=B.RS_NO
GROUP BY A.PRD_NO,A.RS_NO)AA
,
(select prd_no,rs_no,sum(QTY)AS QTY from 
(SELECT  DISTINCT JB_NO FROM JM_JOB_rEC WHERE RS_NO IN ('Z3ZP-803','Z3ZP-K02','Z3ZP301','Z3ZPLJQ01',
'Z3ZPLJQ02','Z3ZPLJQ03','Z3ZPLJQ04','Z3ZPLJQ05','Z3ZPLJQ06','Z3ZPLJQ07','Z3ZPLJQ08') AND DateDiff(day,op_dd,getdate())<7)A,JM_JOB B 
WHERE A.JB_NO=B.JB_NO group BY RS_NO,PRD_NO)BB,JM_PRDT CC,jm_resource DD WHERE AA.PRD_NO=BB.PRD_NO AND AA.RS_NO=BB.RS_NO AND AA.PRD_NO=CC.PRD_NO AND DD.RS_NO=AA.RS_NO
UNION ALL
SELECT H.NAME AS JGZY,G.PRD_NO,F.NAME,E.QTY,G.QTY_FIN,'0' AS QTY_LOST FROM 
(SELECT  rs_no,qty_fin,prd_no from (
SELECT RS_NO,SUM(QTY_CUR) AS QTY_FIN,PRD_nO FROM JM_JOB_REC 
WHERE RS_NO IN('Z3MH01','Z3MH02','Z3MH03','Z3MH04','Z3MH05','Z3MH06','Z3MH07') AND DateDiff(day,op_dd,getdate())<7 GROUP BY PRD_NO,RS_NO)F)G
,
(select prd_no,SUM(QTY) AS QTY from 
(select DISTINCT JB_NO,qty,PRD_NO from jm_job where jb_no IN (SELECT jb_no FROM JM_JOB_REC 
WHERE RS_NO IN('Z3MH01','Z3MH02','Z3MH03','Z3MH04','Z3MH05','Z3MH06','Z3MH07') AND DateDiff(day,op_dd,getdate())<7))C  GROUP BY PRD_NO) E,JM_PRDT F,JM_RESOURCE H
where G.PRD_NO=E.PRD_NO AND G.PRD_NO=F.PRD_NO AND H.RS_NO=G.RS_NO`
        return test.recordset
    }
    catch (err) {
        console.log("报错了")
    }
}


// 连接器车间的折线数据
async function lianjieqi_line() {
    try {
        await sql.connect(config_mes)
        let test = await sql.query`select  a.op_dd,b.dep,e.name,sum(a.qty_cur) as qty_cur from jm_job_rec a left join  jm_mo_mf b on a.mo_no=b.sid left join jm_dept e on b.dep=e.dep where b.dep='B1101' and DateDiff(dd,a.op_dd,getdate())<=7  group by a.op_dd,b.dep,e.name order by a.op_dd`
        return test.recordset
    }
    catch (err) {
        console.log("报错了")
    }
}



// 连接器车间和温控器车间的表格数据
async function wenkong_lianjie() {
    try {
        await sql.connect(config_mes)
        let test = await sql.query`select a.mo_no,f.name as jgzy,a.prd_no,c.name,d.qty,d.qty_fin,isnull(h.qty_lost,0) as qty_lost
        from jm_job_rec a(nolock) left join jm_resource f on a.rs_no=f.rs_no left join 
jm_worker g on a.wk_no=g.wk_no left join jm_job d on a.mo_no=d.sid and a.jb_no=d.jb_no left join jm_job_chk h on h.mo_no=d.sid and h.jb_no=d.jb_no,jm_mo_mf b(nolock) left join jm_prdt c on b.prd_no=c.prd_no left join jm_dept e on b.dep=e.dep
        where a.mo_no=b.sid  and ( b.dep='B1101' or b.dep='B1102') and DateDiff(day,a.op_dd,getdate())<7 and  a.qty_cur>0  and 
f.rs_no in ('B1119006','B1119009','B1119010','B1119018','B1119019','B1119020','B1119033','B1119034','B1119035','B1119035','B1119036','B1119037','B1119038','B1119042','B1119053','B1119055','B1119056','B1119057','B1119067','B1119088','B1119108','B1119109','B1119112','B1119154','Z3SP02','Z3SP03','Z3SP05','Z3ZP201','Z3ZHZDCS')
        group by a.mo_no,f.name,a.prd_no,c.name,d.qty,d.qty_fin,h.qty_lost`
        return test.recordset
    }
    catch (err) {
        console.log("报错了")
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

// 最后添加的  合格率，合格总数
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
        console.log("合格率报错了")
    }
}

// 临时添加的四楼温控器
async function four_wenkong() {
    try {
        await sql.connect(config_mes)
        let test = await sql.query`   select a.mo_no,f.name as jgzy,a.prd_no,c.name,d.qty,d.qty_fin,isnull(h.qty_lost,0) as qty_lost
from jm_job_rec a(nolock) left join jm_resource f on a.rs_no=f.rs_no left join 
jm_worker g on a.wk_no=g.wk_no left join jm_job d on a.mo_no=d.sid and a.jb_no=d.jb_no left join jm_job_chk h on h.mo_no=d.sid ,jm_mo_mf b(nolock) left join 
jm_prdt c on b.prd_no=c.prd_no left join jm_dept e on b.dep=e.dep
where a.mo_no=b.sid  and (b.dep='B1101' or  b.dep='B1102') and DateDiff(DAY,a.op_dd,getdate())<7 and  a.qty_cur>0  and 
f.rs_no in ('Z3ZDCS-5','Z3ZDCS-8','Z3ZDCS-9','Z3ZDCS-P''Z3ZP01','Z3ZP02','Z3ZP03','Z3ZP04','Z3ZP05','Z3ZP06',
'Z3ZP07','Z3ZP08','Z3ZP09','Z3ZP10','Z3ZP11','Z3ZP12','Z3ZP13','Z3ZP14','Z3ZP15','Z3ZP568BK1')
group by a.mo_no,f.name,a.prd_no,c.name,d.qty,d.qty_fin,h.qty_lost`
        return test.recordset
    }
    catch (err) {
        console.log("四楼温控器报错了")
    }
}



async function five_shougong() {
    try {
        await sql.connect(config_mes)
        let test = await sql.query`SELECT A.SID,A.PRD_NO,B.PRD_NAME AS name,isnull(A.QTY,0) AS qty,ISNULL(A.qty_fin,0) AS qty_fin,'0' AS qty_lost  FROM JM_job a, jm_mo_mf b  
where a.sid=b.sid and  a.sorg='B10' AND a.PRD_NO LIKE '61%' and datediff(day,b.hpdate,getdate())<20`
        return test.recordset
    }
    catch (err) {
        console.log("四楼温控器报错了")
    }
}

// 一车间的折线数据
async function five_shougong_line() {
    try {
        await sql.connect(config_mes)
        let test = await sql.query`
select  c.op_dd,isnull(d.qty_cur,'0') as qty_cur from 
(select  distinct op_dd from jm_job_Rec where datediff(dd,op_dd,getdate())<=6)C left join 
(select  a.op_dd,sum(a.qty_cur) as qty_cur from jm_job_rec a left join  jm_mo_mf b on a.mo_no=b.sid  where b.dep='B10' and a.prd_no like '61%'  and DateDiff(dd,a.op_dd,getdate())<=7  group by a.op_dd )D
on c.op_Dd=d.op_dd`
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

app.get('/progress', async function (req, res) {
    let page = req.query.page
    let size = req.query.size
    await progress().then(data => {
        let data_list = data.slice((size * page - size), size * page)
        console.log(data)
        res.json({ 'data': data_list, 'length': data.length })
    })
});
app.get('/progress_line', async function (req, res) {
    await progress_line().then(data => {
        res.json({ 'data': data, 'length': data.length })
    })
});


// 塑料车间接口
app.get('/zhusu', async function (req, res) {
    let page = req.query.page
    let size = req.query.size
    await zhusu().then(data => {
        let data_list = data.slice((size * page - size), size * page)
        console.log(data)
        res.json({ 'data': data_list, 'length': data.length })
    })
});

app.get('/zhusu_line', async function (req, res) {
    await zhusu_line().then(data => {
        res.json({ 'data': data, 'length': data.length })
    })
});
//温控器接口
app.get('/wenkongqi', async function (req, res) {
    let page = req.query.page
    let size = req.query.size
    await wenkongqi().then(data => {
        let data_list = data.slice((size * page - size), size * page)
        console.log(data)
        res.json({ 'data': data_list, 'length': data.length })
    })
});

app.get('/wenkongqi_line', async function (req, res) {
    await wenkongqi_line().then(data => {
        res.json({ 'data': data, 'length': data.length })
    })
});
//连接器接口
app.get('/lianjieqi', async function (req, res) {
    let page = req.query.page
    let size = req.query.size
    await lianjieqi().then(data => {
        let data_list = data.slice((size * page - size), size * page)
        console.log(data)
        res.json({ 'data': data_list, 'length': data.length })
    })
});

app.get('/lianjieqi_line', async function (req, res) {
    await lianjieqi_line().then(data => {
        res.json({ 'data': data, 'length': data.length })
    })
});

//连接器和温控器接口
app.get('/wenkong_lianjie', async function (req, res) {
    let page = req.query.page
    let size = req.query.size
    await wenkong_lianjie().then(data => {
        let data_list = data.slice((size * page - size), size * page)
        console.log(data)
        res.json({ 'data': data_list, 'length': data.length })
    })
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
        let data_list = data.slice((size * page - size), size * page)
        res.json({ 'data': data_list, 'length': data.length })
    })
    // res({ 'data': data_list, 'length': data.length })
});


app.get('/four_wenkong', async function (req, res) {
    let page = req.query.page
    let size = req.query.size
    await four_wenkong().then(data => {
        let data_list = data.slice((size * page - size), size * page)
        res.json({ 'data': data_list, 'length': data.length })
    })
    // res({ 'data': data_list, 'length': data.length })
});

app.get('/five_shougong', async function (req, res) {
    let page = req.query.page
    let size = req.query.size
    await five_shougong().then(data => {
        let data_list = data.slice((size * page - size), size * page)
        res.json({ 'data': data_list, 'length': data.length })
    })
    // res({ 'data': data_list, 'length': data.length })
});


app.get('/five_shougong_line', async function (req, res) {
    await five_shougong_line().then(data => {
        res.json({ 'data': data, 'length': data.length })
    })
});


app.listen(4001);