var http = require('http')
var url = require('url')
var ejs = require('ejs')


const sql = require('mssql') //声明插件

// erp数据库信息
const config_erp = {
    user: 'sa',
    password: 'Txts@1911',
    server: '192.168.8.11',
    database: 'DB_JTERP'
}


// 零件仓数据sql语句
async function part() {
    try {
        await sql.connect(config_erp)
        let test = await sql.query`select c.snm as csmc,b.prd_no,b.prd_name,e.ut,sum(b.qty) as ddsl,sum(isnull(b.qty_ps,0)) as jhsl  from mf_pos a left join tf_pos b on a.os_no=b.os_no 
 left join cust c on a.cus_no = c.cus_no left join my_wh d on b.wh=d.wh  left join prdt e on b.prd_no = e.prd_no where DateDiff(dd,a.os_dd,getdate())<=30 and b.qty > b.qty_ps and b.wh='B01' 
 group by c.snm ,b.prd_no,b.prd_name, e.ut union all select h.snm,f.mrp_no,i.name,g.ut,f.qty,isnull(f.qty_rtn,0) as qty_rtn from MF_TW f  left join prdt g on f.mrp_no=g.prd_no left join my_wh p on f.wh=p.wh
left join cust h on f.cus_no=h.cus_no  left join prdt i on i.prd_no=f.mrp_no where f.close_id !='T' and DateDiff(dd,f.tw_dd,getdate())<=30 and f.wh='B01'`
        return test.recordset
    }
    catch (err) {
        console.log("零件仓报错了")
    }
}

// 零件仓柱状图sql语句
async function part_zhu() {
    try {
        await sql.connect(config_erp)
        let test = await sql.query`select c.snm as csmc,sum(b.qty) as ddsl,sum(isnull(b.qty_ps,0)) as jhsl  from mf_pos a left join tf_pos b on a.os_no=b.os_no 
 left join cust c on a.cus_no = c.cus_no left join my_wh d on b.wh=d.wh  left join prdt e on b.prd_no = e.prd_no 
where DateDiff(dd,a.os_dd,getdate())<=30 and b.qty > isnull(b.qty_ps,0) and b.wh='B01'
 group by c.snm  
union all 
select h.snm,sum(f.qty) as ddsl,sum(isnull(f.qty_rtn,0)) as qty_rtn from MF_TW f  left join prdt g on f.mrp_no=g.prd_no left join my_wh p on f.wh=p.wh
left join cust h on f.cus_no=h.cus_no  left join prdt i on i.prd_no=f.mrp_no 
where f.close_id !='T' and DateDiff(dd,f.tw_dd,getdate())<=30 and f.wh='B01'  and g.snm not like '%未镀%' group by h.snm`
        return test.recordset
    }
    catch (err) {
        console.log("零件仓柱状图报错了")
    }
}

// 零件折线图sql语句
async function part_line() {
    try {
        await sql.connect(config_erp)
        let test = await sql.query`select replace(cast(b.SNM as varchar(100)),'有限公司','') as SNM,COUNT(snm) as cs from MF_PSS a left join CUST b on a.CUS_NO = b.CUS_NO left join dept c on a.dep=c.dep
where PS_ID in ('PB','SB','TC') and a.dep='B01' group by a.CUS_NO,b.SNM`
        return test.recordset
    }
    catch (err) {
        console.log("零件仓折线图报错了")
    }
}


// 原料仓数据sql语句
async function yuanliao() {
    try {
        await sql.connect(config_erp)
        let test = await sql.query`SELECT  C.SNM AS NAME,T.PRD_NO as prd_no,T.PRD_NAME as prd_name,SUM(T.QTY) AS ddsl,SUM(ISNULL(T.QTY_PS,0)) AS jhsl ,SUM(T.QTY)-SUM(ISNULL(T.QTY_PS,0)) QTY_YE FROM TF_POS T
 INNER JOIN MF_POS M ON T.OS_NO=M.OS_NO
 INNER JOIN CUST C ON M.CUS_NO=C.CUS_NO 
 WHERE T.OS_ID='PO' AND  T.WH='B02' AND MONTH(M.OS_DD)=MONTH(GETDATE()) 
 GROUP BY M.CUS_NO,C.SNM,T.PRD_NO,T.PRD_NAME`
        return test.recordset
    }
    catch (err) {
        console.log("原料仓报错了")
    }
}

// 原料仓柱状图sql语句
async function yuanliao_zhu() {
    try {
        await sql.connect(config_erp)
        let test = await sql.query`select c.snm as csmc,sum(b.qty) as ddsl,sum(isnull(b.qty_ps,0)) as jhsl  from mf_pos a left join tf_pos b on a.os_no=b.os_no 
 left join cust c on a.cus_no = c.cus_no left join my_wh d on b.wh=d.wh  left join prdt e on b.prd_no = e.prd_no 
where DateDiff(dd,a.os_dd,getdate())<=30 and b.qty > isnull(b.qty_ps,0) and b.wh='B02'
 group by c.snm  
union all 
select h.snm,sum(f.qty) as ddsl,sum(isnull(f.qty_rtn,0)) as qty_rtn from MF_TW f  left join prdt g on f.mrp_no=g.prd_no left join my_wh p on f.wh=p.wh
left join cust h on f.cus_no=h.cus_no  left join prdt i on i.prd_no=f.mrp_no 
where f.close_id !='T' and DateDiff(dd,f.tw_dd,getdate())<=30 and f.wh='B02'  and g.snm not like '%未镀%' group by h.snm`
        return test.recordset
    }
    catch (err) {
        console.log("零件仓报错了")
    }
}

// 原料折线图sql语句
async function yuanliao_line() {
    try {
        await sql.connect(config_erp)
        let test = await sql.query`select replace(cast(b.SNM as varchar(100)),'有限公司','') as SNM,COUNT(snm) as cs from MF_PSS a left join CUST b on a.CUS_NO = b.CUS_NO left join dept c on a.dep=c.dep
where PS_ID in ('PB','SB','TC') and a.dep='B02' group by a.CUS_NO,b.SNM`
        return test.recordset
    }
    catch (err) {
        console.log("原料仓折线图报错了")
    }
}

// 成品仓数据sql语句
async function chenpin() {
    try {
        await sql.connect(config_erp)
        let test = await sql.query`SELECT C.SNM,A.PRD_NO,P.NAME,ISNULL(A.QTY,0) AS QTY,ISNULL(A.BOX,0) AS BOX,ISNULL(A.QTY_PS,0) AS QTY_PS,ISNULL(A.QTY,0)-ISNULL(A.QTY_PS,0) wfl,ISNULL(D.QTY,0) as kcl FROM 
   (

   SELECT M.CK_NO,M.CUS_NO,K.PRD_NO,K.QTY,ISNULL(DZ.BOX_WHOLE,0)+ISNULL(DZ.BOX_WHOLE,0) AS BOX,isnull(DS.QTY_PS,0) qty_ps FROM TF_CK K
    left JOIN MF_CK_Z Z ON K.CK_NO=Z.CK_NO
    INNER JOIN MF_CK M ON K.CK_NO=M.CK_NO
    LEFT JOIN TF_DS DS ON K.CK_NO=DS.BIL_NO AND K.EST_ITM=DS.EST_ITM
    LEFT JOIN TF_DS_Z DZ ON DS.DS_NO=DZ.DS_NO AND DS.ITM=DZ.ITM
    WHERE ISNULL(Z.SDFH,'')<>'T' AND K.WH='B06' AND DateDiff(dd,K.CK_dd,getdate())=0  AND DateDiff(dd,DS.DS_dd,getdate())=0
         UNION ALL 

    SELECT M1.CK_NO,M1.CUS_NO,K1.PRD_NO,K1.QTY,ROUND(K1.QTY /ISNULL(PP.PACK_QTY,1)-0.4,0)+ISNULL(KZ.BOX_PART,0) AS BOX,isnull(k1.qty_ps,0) qty_ps FROM TF_CK K1
    left JOIN MF_CK_Z Z1 ON K1.CK_NO=Z1.CK_NO
    INNER JOIN MF_CK M1 ON K1.CK_NO=M1.CK_NO
    left join TF_CK_Z KZ ON K1.CK_NO=KZ.CK_NO AND K1.ITM=KZ.ITM
    LEFT JOIN DB_JTMES..jm_prdt_jt PP ON K1.PRD_NO=PP.PRD_NO
    WHERE ISNULL(Z1.SDFH,'')<>'T' AND K1.WH='B05' AND DateDiff(dd,K1.CK_dd,getdate())=0  AND PP.CID='1'
   UNION ALL

    SELECT D2.DS_NO,Z2.CUS_NO1,D2.PRD_NO,D2.QTY,ISNULL(Z2.BOX_WHOLE,0)+ISNULL(Z2.BOX_WHOLE,0) AS BOX,isnull(D2.qty_ps,0) qty_ps FROM TF_DS D2 
    INNER JOIN TF_DS_Z Z2 ON D2.DS_NO=Z2.DS_NO AND D2.ITM=Z2.ITM
    WHERE DateDiff(dd,D2.DS_dd,getdate())=0 AND D2.BIL_ID<>'CK'
    ) A
       INNER JOIN CUST C ON C.CUS_NO=A.CUS_NO
    INNER JOIN PRDT P ON P.PRD_NO=A.PRD_NO
    LEFT JOIN 
    (
     SELECT PRD_NO,SUM(QTY) QTY  FROM ( SELECT PRD_NO,SUM(ISNULL(QTY,0)) AS QTY FROM PRDT1  WHERE WH='B05' GROUP BY PRD_NO
   UNION ALL 
   SELECT PRD_NO,SUM(ISNULL(QTY_IN,0)-ISNULL(QTY_OUT,0)) AS  QTY FROM BAT_REC1 WHERE WH='B05'  GROUP BY PRD_NO ) A 
   GROUP BY A.PRD_NO
    ) D ON A.PRD_NO=D.PRD_NO
      --  GROUP BY A.CUS_NO,C.NAME,A.PRD_NO,P.NAME,P.UT`
        return test.recordset
    }
    catch (err) {
        console.log("成品仓报错了")
    }
}

// 成品仓柱状图sql语句
async function chenpin_zhu() {
    try {
        await sql.connect(config_erp)
        let test = await sql.query`select c.snm as csmc,sum(b.qty) as ddsl,sum(isnull(b.qty_ps,0)) as jhsl  from mf_pos a left join tf_pos b on a.os_no=b.os_no 
 left join cust c on a.cus_no = c.cus_no left join my_wh d on b.wh=d.wh  left join prdt e on b.prd_no = e.prd_no 
where DateDiff(dd,a.os_dd,getdate())<=30 and b.qty > isnull(b.qty_ps,0) and (b.wh='B05' or b.wh='B06')
 group by c.snm  
union all 
select h.snm,sum(f.qty) as ddsl,sum(isnull(f.qty_rtn,0)) as qty_rtn from MF_TW f  left join prdt g on f.mrp_no=g.prd_no left join my_wh p on f.wh=p.wh
left join cust h on f.cus_no=h.cus_no  left join prdt i on i.prd_no=f.mrp_no 
where f.close_id !='T' and DateDiff(dd,f.tw_dd,getdate())<=30 and (f.wh='B05' or f.wh='B06')  and g.snm not like '%未镀%' group by h.snm`
        return test.recordset
    }
    catch (err) {
        console.log("零件仓报错了")
    }
}

// 成品折线图sql语句
async function chenpin_line() {
    try {
        await sql.connect(config_erp)
        let test = await sql.query`select replace(cast(b.SNM as varchar(100)),'有限公司','') as SNM,COUNT(snm) as cs from MF_PSS a left join CUST b on a.CUS_NO = b.CUS_NO left join dept c on a.dep=c.dep
where PS_ID in ('PB','SB','TC') and (a.dep='B05' or a.dep='B06') group by a.CUS_NO,b.SNM`
        return test.recordset
    }
    catch (err) {
        console.log("成品仓折线图报错了")
    }
}

// 顺德仓数据sql语句
async function shunde() {
    try {
        await sql.connect(config_erp)
        let test = await sql.query`select c.snm as csmc,b.prd_no,b.prd_name,e.ut,sum(b.qty) as ddsl,sum(isnull(b.qty_ps,0)) as jhsl  from mf_pos a left join tf_pos b on a.os_no=b.os_no 
 left join cust c on a.cus_no = c.cus_no left join my_wh d on b.wh=d.wh  left join prdt e on b.prd_no = e.prd_no where DateDiff(dd,a.os_dd,getdate())<=30 and b.qty > b.qty_ps and b.wh='B06' 
 group by c.snm ,b.prd_no,b.prd_name, e.ut union all select h.snm,f.mrp_no,i.name,g.ut,f.qty,isnull(f.qty_rtn,0) as qty_rtn from MF_TW f  left join prdt g on f.mrp_no=g.prd_no left join my_wh p on f.wh=p.wh
left join cust h on f.cus_no=h.cus_no  left join prdt i on i.prd_no=f.mrp_no where f.close_id !='T' and DateDiff(dd,f.tw_dd,getdate())<=30 and f.wh='B06'`
        return test.recordset
    }
    catch (err) {
        console.log("顺德仓报错了")
    }
}

// 托工仓数据sql语句
async function tuogong() {
    try {
        await sql.connect(config_erp)
        let test = await sql.query`SELECT D.SNM,E.NAME AS NAME,SUM(ISNULL(A.QTY,'0')) AS M_QTY,C.PRD_NAME AS PRD_NAME,SUM(ISNULL(B.QTY,'0')) AS T_QTY,SUM(ISNULL(C.QTY,'0')) AS QTY_RTN,
CASE WHEN (SUM(ISNULL(B.QTY,'0'))-SUM(ISNULL(C.QTY,'0')))>0 THEN  (SUM(ISNULL(B.QTY,'0'))-SUM(ISNULL(C.QTY,'0'))) ELSE 0 END AS QTY_YE FROM MF_TW A 
INNER JOIN TF_TW B ON A.TW_NO=B.TW_NO
RIGHT JOIN TF_MC C ON B.TW_NO=C.OS_NO AND B.PRD_NO=C.PRD_NO
INNER JOIN CUST D ON C.WH2=D.CUS_NO
INNER JOIN PRDT E ON E.PRD_NO=A.MRP_NO
WHERE C.WH1='B02' AND C.WH2 LIKE 'WZ%'
AND A.TW_DD>=(select (CASE WHEN DAY(GETDATE())<26 THEN CONVERT(VARCHAR(7),GETDATE()-DAY(GETDATE()),120)+'-26'
  ELSE CONVERT(VARCHAR(7),GETDATE(),120)+'-26' END)) AND C.MC_DD>=(select (CASE WHEN DAY(GETDATE())<26 THEN CONVERT(VARCHAR(7),GETDATE()-DAY(GETDATE()),120)+'-26'
  ELSE CONVERT(VARCHAR(7),GETDATE(),120)+'-26' END))
GROUP BY C.WH2,D.SNM,E.NAME,C.PRD_NO,C.PRD_NAME
 ORDER BY C.WH2`
        return test.recordset
    }
    catch (err) {
        console.log("顺德仓报错了")
    }
}



// // 进度仓数据sql语句  
// async function progress(){
//     try{
//         await sql.connect(config_mes)
//         let test = await sql.query`select a.op_dd,b.dep,a.mo_no,a.jb_no,a.rs_no,a.prd_no,c.name,d.qty,d.qty_fin,sum(a.qty_cur) as qty_cur,a.wk_no
//         from jm_job_rec a(nolock) left join jm_job d on a.mo_no=d.sid and a.jb_no=d.jb_no,jm_mo_mf b(nolock) left join jm_prdt c on b.prd_no=c.prd_no
//         where a.mo_no=b.sid and ( a.op_dd>='2020-03-19' and a.op_dd<'2020-03-20' or a.op_dd='') and ( b.dep='B1102' or b.dep='') and  a.qty_cur>0  
//         group by a.op_dd,b.dep,a.mo_no,a.jb_no,a.rs_no,a.prd_no,c.name,d.qty,d.qty_fin,a.wk_no`
//         return test.recordset
//     }
//     catch(err){
//         console.log("报错了")
//     }
// }


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
// 零减仓接口
app.get('/part', async function (req, res) {
    let page = req.query.page
    let size = req.query.size
    await part().then(data => {
        let data_list = data.slice((size * page - size), size * page)
        console.log(data)
        res.json({ 'data': data_list, 'length': data.length })
    })
});
// 零减仓柱状图接口
app.get('/part_zhu', async function (req, res) {
    let page = req.query.page
    let size = req.query.size
    await part_zhu().then(data => {
        let data_list = data.slice((size * page - size), size * page)
        console.log(data)
        res.json({ 'data': data_list, 'length': data.length })
    })
});

// 零减折线图接口
app.get('/part_line', async function (req, res) {
    let page = req.query.page
    let size = req.query.size
    await part_line().then(data => {
        let data_list = data.slice((size * page - size), size * page)
        console.log(data)
        res.json({ 'data': data_list, 'length': data.length })
    })
});

// 原料仓接口
app.get('/yuanliao', async function (req, res) {
    let page = req.query.page
    let size = req.query.size
    await yuanliao().then(data => {
        let data_list = data.slice((size * page - size), size * page)
        console.log(data)
        res.json({ 'data': data_list, 'length': data.length })
    })
});

// 原料仓柱状图接口
app.get('/yuanliao_zhu', async function (req, res) {
    let page = req.query.page
    let size = req.query.size
    await yuanliao_zhu().then(data => {
        let data_list = data.slice((size * page - size), size * page)
        console.log(data)
        res.json({ 'data': data_list, 'length': data.length })
    })
});

// 原料仓折线图接口
app.get('/yuanliao_line', async function (req, res) {
    let page = req.query.page
    let size = req.query.size
    await yuanliao_line().then(data => {
        let data_list = data.slice((size * page - size), size * page)
        console.log(data)
        res.json({ 'data': data_list, 'length': data.length })
    })
});
// 成品仓接口
app.get('/chenpin', async function (req, res) {
    let page = req.query.page
    let size = req.query.size
    await chenpin().then(data => {
        let data_list = data.slice((size * page - size), size * page)
        console.log(data)
        res.json({ 'data': data_list, 'length': data.length })
    })
});
// 成品仓柱状图接口
app.get('/chenpin_zhu', async function (req, res) {
    let page = req.query.page
    let size = req.query.size
    await chenpin_zhu().then(data => {
        let data_list = data.slice((size * page - size), size * page)
        console.log(data)
        res.json({ 'data': data_list, 'length': data.length })
    })
});

// 成品仓折线图接口
app.get('/chenpin_line', async function (req, res) {
    let page = req.query.page
    let size = req.query.size
    await chenpin_line().then(data => {
        let data_list = data.slice((size * page - size), size * page)
        console.log(data)
        res.json({ 'data': data_list, 'length': data.length })
    })
});
// 顺德仓接口
app.get('/shunde', async function (req, res) {
    let page = req.query.page
    let size = req.query.size
    await shunde().then(data => {
        let data_list = data.slice((size * page - size), size * page)
        console.log(data)
        res.json({ 'data': data_list, 'length': data.length })
    })
});

app.get('/tuogong', async function (req, res) {
    let page = req.query.page
    let size = req.query.size
    await tuogong().then(data => {
        let data_list = data.slice((size * page - size), size * page)
        console.log(data)
        res.json({ 'data': data_list, 'length': data.length })
    })
});





app.listen(4000);