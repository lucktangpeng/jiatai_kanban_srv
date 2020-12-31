// const sql = require('mssql') //声明插件
// const config = {
//     user:'sa',
//     password: 'abc.123',
//     server: '192.168.3.11', 
//     database: 'DB_JUST'
// }
// sql.connect(config).then(() => {
//     return sql.query`SELECT CHUW,WH,PRD_NO,BAT_NO,QTY FROM PRDT1_CW`
// }).then(result => {
//     //请求成功
//     console.log(result)
// }).catch(err => {
//     //err 处理
// })
// sql.on('error', err => {
//     //error 处理
// })



const sql = require('mssql') //声明插件
const config = {
    user:'sa',
    password: 'abc.123',
    server: '192.168.3.11', 
    database: 'DB_JUST'
}

async function test(callback){
    try{
        await sql.connect(config)
        var test = await sql.query`SELECT CHUW,WH,PRD_NO,BAT_NO,QTY FROM PRDT1_CW`
        // console.log(test.recordset[0])
        // callback(test.recordset)
        return test.recordset

    }
    catch(err){
        // console.log(err)
        // return err

        console.log("报错了")
    }

}

var obk = test()
obk.then(date => {
    console.log(date)
})
// console.log(obk)
// test(function(data){
//     console.log(1)
//     console.log(data)
// })
// test(callback(tests => {
//     console.log(tests)
// }))



// function doubleAfter2seconds(num) {
//     // return new Promise((resolve, reject) => {
//     //     setTimeout(() => {
//     //         resolve(2 * num)
//     //     }, 2000);
//     // } )
//         setTimeout(() => {
//             console.log((2 * num))
//             return (2 * num)
//         }, 2000);
// }

// async function testResult() {
//     let result = await doubleAfter2seconds(30);
//     console.log(result);
// }

// doubleAfter2seconds(20).then(val => {
//     console.log(val)
// })


// sql.connect(config).then(() => {
//     return sql.query`SELECT CHUW,WH,PRD_NO,BAT_NO,QTY FROM PRDT1_CW`
// }


// const sql = require('mssql')
 
// async () => {
//     try {
//         // make sure that any items are correctly URL encoded in the connection string
//         await sql.connect('mssql://sa:abc.123@192.168.3.11/DB_JUST')
//         const result = await sql.query`SELECT CHUW,WH,PRD_NO,BAT_NO,QTY FROM PRDT1_CW`
//         console.dir(result)
//         console.log(result)
//     } catch (err) {
//         // ... error checks
//     }
// }

// function doubleAfter2seconds(num) {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve(2 * num)
//         }, 2000);
//     } )
// }
// console.log(doubleAfter2seconds(2))
// console.log(123)

// async function testResult() {
//     let result = await doubleAfter2seconds(30);
//     console.log(result);
// }
// doubleAfter2seconds(20).then(val =>{
//     console.log(val)
// })
// testResult();
// console.log(123)