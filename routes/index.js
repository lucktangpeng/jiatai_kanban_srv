var express = require('express');
// 导入数据库插件
const sql = require('mssql')
var router = express.Router();


// erp数据库信息
const config_erp = {
    user:'sa',
    password: 'Txts@1911',
    server: '192.168.8.11', 
    database: 'DB_JTERP',
}

// 零件仓数据sql语句  
async function part(){
    try{
        await sql.connect(config_erp)
        let test = await sql.query`select  a.prd_no,g.name,g.ut,cast(subString(isnull(g.spc,''),1,200) as varchar) as spc,sum(isnull(a.qty_in,0)) as qty_in,
        sum(isnull(a.qty_out,0)) as qty_out,sum(isnull(a.qty_in,0) - isnull(a.qty_out,0)) As qty_end
        from bat_rec1 a(nolock), PRDT g(nolock) where a.prd_no=g.prd_no and a.lst_ind>'2020-01-01' and (a.lst_ind='' or a.lst_ind>='2020-03-16' and a.lst_ind<'2020-03-17' )
        and (a.wh=''  or a.wh='B01' ) and a.wh='B01' group by a.wh,a.prd_no,g.name,g.ut,cast(subString(isnull(g.spc,''),1,200) as varchar)`
        return test.recordset
    }
    catch(err){
        console.log(err)
        console.log("零件仓报错了")
    }
}


router.get('/', async function(req, res) {
    let page = req.query.page
    let size = req.query.size
    await part().then( data => {
    let data_list = data.slice((size * page - size),size * page)
    console.log(data)
    res.json({'data':data_list,'length': data.length})
    })
  });


module.exports = router;