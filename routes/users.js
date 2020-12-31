var express = require('express');
// 导入数据库插件
const sql = require('mssql')
var router = express.Router();

// mes数据库信息
const config_mes = {
    user:'sa',
    password: 'Txts@1911',
    server: '192.168.8.11', 
    database: 'DB_JTMES',
}
async function er(){
    try{
        await sql.connect(config_mes)
        let test = await sql.query`select a.op_dd,b.dep,a.mo_no,a.jb_no,a.rs_no,a.prd_no,c.name,d.qty,d.qty_fin,sum(a.qty_cur) as qty_cur,a.wk_no
        from jm_job_rec a(nolock) left join jm_job d on a.mo_no=d.sid and a.jb_no=d.jb_no,jm_mo_mf b(nolock) left join jm_prdt c on b.prd_no=c.prd_no
        where a.mo_no=b.sid and ( a.op_dd>='2020-03-19' and a.op_dd<'2020-03-20' or a.op_dd='') and ( b.dep='B1102' or b.dep='') and  a.qty_cur>0  
        group by a.op_dd,b.dep,a.mo_no,a.jb_no,a.rs_no,a.prd_no,c.name,d.qty,d.qty_fin,a.wk_no`
        return test.recordset
    }
    catch(err){
        console.log("零件仓报错了")
    }
}

router.get('/', function(req, res) {
    let page = req.query.page
    let size = req.query.size
    er().then( data => {
    let data_list = data.slice((size * page - size),size * page)
    console.log(data)
    res.json({'data':data_list,'length': data.length})
    })
  });

module.exports = router;