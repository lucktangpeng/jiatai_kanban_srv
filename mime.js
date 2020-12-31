var fs = require("fs")
exports.getMime=function(pathname){
    data = fs.readFileSync("./mime.json")
    date = data.toString()
    extname = JSON.parse(date)
    return extname[pathname]
}