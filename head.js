// var http = require('http')
// var url = require('url')

// http.createServer(function(request,response){
//     response.writeHead(200,{"Content-Type":"text/html;charset=UTF8"});
//     response.write("哈哈哈，第一个nodejs程序");
//     if(request.url != "/favicon.ico"){
//         console.log(request.url)
//         console.log(url.parse(request.url))
//     }
//     response.end();
// }).listen(8888)

// console.log('Server running at http://127.0.0.1:8888')


// fs.stat("update",function(err,status){
//     if(err){
//         fs.mkdir("update",function(error){
//             if(error){
//                 console.log(error)
//                 return false
//             }
//             console.log(创建成功)
//         })
//     }
//     console.log(status.isDirectory())
//     console.log("目录已经存在")
// }
// )

// var fs = require('fs')

// fs.readdir("update",function(err,status){

//     if(err){
//         return err
//     }
//     var funarr = [];
//     var val = (function test(i){
//         if(i == status.length){
//             return false
//         }
//         fs.stat("update/"+status[i],function(error,stat){
            
//             if(error){
//                 console.log(error)
//                 return false
//             }
//             // console.log(status[i])
//             if(stat.isDirectory()){
//                 console.log(funarr)
//                 funarr.push(status[i])
//             }
//             // console.log(funarr)
//         })
//         // console.log(funarr)
//         test(i+1)
//         return funarr
//     })(0)
// })
// console.log(funarr)
// var fs = require('fs')

// var filesArr=[];
// fs.readdir('html',function(err,files){
//              if(err){
//                     console.log(error);
//                     return false
//              }else{  /*判断是目录还是文件夹*/
//                  //console.log(files);  /*数组*/

//                  (function getFile(i){

//                      if(i==files.length){  /*循环结束*/
//                          console.log('目录：');
//                          console.log(filesArr);   /*打印出所有的目录*/
//                          return false;

//                      }
//                      //files[i]  =   css  js   news.html
//                      //注意：目录
//                      fs.stat('html/'+files[i],function(error,stats){  /*循环判断是目录还是文件  ---异步 错误写法*/
//                         if(error){
//                             return false
//                         }
//                          if(stats.isDirectory()){ /*目录*/

//                              filesArr.push (files[i]);  /*保存数据*/
//                          }


//                          //递归掉用
//                          getFile(i+1);
//                      })
//                  })(0)

//              }


// })

// var http = require("http")
// var fs = require("fs")
// var path = require("path")
// var url = require("url")
// var mimemodal = require("./mime.js")
// http.createServer(function(request,response){
    
//     var pathname = request.url
//     if( pathname != "/favicon.ico"){
//         if(pathname == "/"){
//             pathname = "/index.html"
//         }
//         pathname = url.parse(pathname).pathname
//         fs.readFile("static"+pathname,function(err,data){
//             if(err){
//                 console.log(404)
//             }else{
//                 var extname = path.extname(pathname)
//                 var mima = mimemodal.getMime(extname)
//                 response.writeHead(200,{"content-Type":""+mima+";charset=UTF8"});
//                 response.write(data)
//                 response.end()
//             }
//         })
//     }
// }).listen(8001)
// console.log("127.0.0.1:8001")

// var fs = require("fs")

// function getMime(callback){
//     fs.readFile("mime.json",function(err,data){
//         callback(data)
//     })
//     // return 123
// }

// getMime(function(date){
//     console.log(date.toString())
// })

// var
var bodyParser = require('body-parser')
var express = require('express');
var app = express();
var ejs = require('ejs');
app.set('view engine','ejs');
app.use('/static',express.static('public'))

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json 
app.use(bodyParser.json())
// app.use(function (req, res) {
//  res.setHeader('Content-Type', 'text/plain')
//  res.write('you posted:\n')
//  res.end(JSON.stringify(req.body, null, 2))
// })




// app.use(function(req,res,next){
//     console.log(new Date());
//     next();
// })

app.get('/',function(req,res){
    console.log(req.query)
    // res.send('hello nodejs');
    res.render('news',{'name':'你好呀'})
})


app.get('/login',function(req,res,next){
    console.log('我在这里啊')
    next()
})

app.get('/login',function(req,res){
    res.send('login');
});

app.post('/login',function(req,res){
    console.log(req.body)
    res.send("postlogin")
})

app.get('/user/:id',function(req,res){
    console.log(req.params);
    res.send('你猜猜我是谁');
})
app.listen(3000,'127.0.0.1');