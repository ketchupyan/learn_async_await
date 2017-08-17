// const movies = ["霸王别姬", "千与千寻", "肖申克的救赎"]
// // 每部电影的封面请求，中间，插一个sleep1000

// // require 引入http模块
// var http = require('http'), //发送请求
//     // 向url 发出http请求
//     https = require('https'),
//     path = require('path'),  //路径处理
//     // node 后端， 服务器，文件系统
//     fs = require('fs'),  //文件处理
//     cheerio = require('cheerio');
let fs = require('fs'),
path = require('path'),
request = require('request');
const movieDir = __dirname + '/movies', 
exts = ['.mkv', '.avi', '.mp4', '.rm', '.rmvb', '.wmv'];
function readFiles () {
return new Promise((resolve, reject) => {
    fs.readdir(movieDir, (err, files) => {
        resolve(files.filter(file =>
            exts.includes(
                path.parse(file).ext))); 
        /* parse转变为JSon
         * exts.include是否包含 true
         * ES6过滤函数 files.filter(过滤条件)
         */

        /* 1、是否是异步的
         * 2、只要是异步的，最好用Promise包起来,才可以then
         * 3、再await
         */
    })
})
}

function getPoster(name) {
let url = `https://api.douban.com/v2/movie/search?q=${encodeURI(name)}` //encodeURI转码
console.log(url);
return new Promise((resolve, reject) => {
    request({
        url: url ,
        json: true
    }, (error, response, body) => {
        if(error)
            return reject(error)
        console.log(body);
        resolve(body.subjects[0].images.large)            
    })
})
}

let savePoster = (name, url) => {
// 请求的是一张图片 二进制流 流向本地文件夹movies
// createWriteStream 持续写入流
// pipe 将两个流接起来
request.get(url).pipe(
    fs.createWriteStream(path.join(movieDir, name + '.jpg'))
)
}

(async () => {
let files = await readFiles();
for(let file of files) {
    let {name} = path.parse(file)
    console.log(`正在获取[${name}]的海报`);
    // savePoster(name, await getPoster(name)) //2
    // let post_url = await getPoster(name);   //1
    // console.log(post_url);
    // savePoster(name, post_url)
    try {
        savePost(name, await getPoster(name));
    } catch (e) {
        console.log(e);
    }

}
})()