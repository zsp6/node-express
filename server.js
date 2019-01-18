const express = require('express');
const url = require('url');
const path = require('path');
//引入cookieParser 模块(第三方)
const cookieParser = require('cookie-parser');

//生成一个express的实例
const server = express();

//处理 中间件函数 json urlencode
server.use(express.json());
server.use(express.urlencoded({
  extended:true
}));

server.use(cookieParser());

//1. 安装 ejs npm install ejs --save
//2. 设置 express 实例 1.模板文件的存放路径 2.使用的什么模板引擎

//设置 静态文件托管
server.use(express.static('public'));//取名叫public 跟文件中的一样

//设置 模板文件的存放路径;
server.set('views','./views');
//设置 使用的是什么模板引擎
server.set('view engine','ejs');

//设置不同的url地址,让其有不同的一个处理函数,处理业务逻辑
//参数1 表示 http://localhost:3000/
server.get('/',function(req,res){
  //console.log(url.parse(req.url,true).query);
 // console.log(req.query);

  //这块的 req res 与原生的http模块提供的req res是一样的, 只是 express 对这两个对象有一个二次封装,加多了一些属性和方法.
  // res.write('hello express');
  // res.end();

  //3. res.render('模板文件的名字',需要带入到模板文件中的数据)
  res.render('index',{
    name : '<h1>张三</h1>',
    age : 21,
    list : [
      {
        name:'小明'
      },
      {
        name:'小花'
      },
      {
        name:'小兰'
      }
    ],
    like:'red'
  });
  //4. 最终 浏览器,会将模板文件的内容跟数据的内容做拼接 之后再渲染到浏览器
})
//http://localhost:3000/login  get 方式请求
server.get('/login',function(req,res){
  res.writeHead(200,{
    'content-type': 'text/html;charset=utf-8'
  });
  res.write('这个是登录');
  res.end();
})
//post方式请求 http://localhost:3000/post 
server.post('/post',function(req,res){

  //获取 post 的参数
  console.log(req.body);

  console.log('我是一个post请求的回调函数');
  res.write('hello');//不会出现hello ,页面会出现Cannot GET /post 要写一个form表单,里面methoh设置成post就ok  //还有一种方式 借助于Postman这个工具 就可以成功
  res.end();
})

//设置cookie http://localhost:3000/setCookie
server.get('/setCookie',function(req,res){
  res.cookie('name','张三',{
    //maxAge 表示是设置过期时间 以毫秒为单位
    maxAge:60 * 1000 *10//十分钟
  });
  res.writeHead(200,{
    'content-type':'text/html;charset=utf-8'
  });
  res.write('设置成功');
  res.end();
})

//取得 cookie http://localhost:3000/getCookie
//需要使用 cookie-parser 中间件函数(第三方需要下载安装)
server.get('/getCookie',function(req,res){
  console.log(req.cookies);
  res.write('ok');
  res.end();
})

//http://localhost:3000/getUserInfo/zhangsan
//http://localhost:3000/getUserInfo/lisi
//http://localhost:3000/getUserInfo/1234
//:id表示相当于一个占位符 没有定死 上面三个地址都可以访问到
server.get('/getUserInfo/:id',function(req,res){
  console.log(req.params);//{ id: '张三' }//得到地址中输入的值
  res.write('ok');
  res.end();
})
//PS:当浏览器访问这个 http://localhost:3000/getUserInfo 地址时 会报错 Cannot GET /getUserInfo ,上面那样写的话,一定要在后面加点东西,比如http://localhost:3000/getUserInfo/321 就会返回ok
//还可以写多个占位符  //http://localhost:3000/getUserInfo/张三/32
server.get('/getUserInfo/:a/:b',function(req,res){
  console.log(req.params);//{ a: '张三', b: '32' }//得到地址中输入的值
  res.write('ok');
  res.end();
})

//根据 请求头中的 user-angent 的不同,渲染不同的页面
//如果是手机打开这个地址就会是手机的电脑打开就是电脑的
server.get('/fsd',function(req,res){
 // res.set('content-type','text/html;charset=utf-8');
  if(req.get('User-Agent').indexOf('Mobile') != -1){
    //是手机端
    //res.write('mobile');
    //res.send('手机');
    //重定向到百度页面 跳转到百度
    res.redirect('http://www.baidu.com');
  }else{
    //是电脑端
    //res.write('pc');
    res.send('电脑');
  }
  //res.end();
})

//下载 http://localhost:3000/xiazai
server.get('/xiazai',function(req,res){
  res.download('./README.md');
})

//style.css的请求
//http://localhost:3000/public/style.css
// server.get('/public/style.css',function(req,res){
//   console.log('有没有');
//   //res.sendFile('./public/style.css')//会报错
//   res.sendFile(path.resolve(__dirname,'./public/style.css'))
// })

//js的请求
//http://localhost:3000/public/index.js
// server.get('/public/index.js',function(req,res){
//   res.sendFile(path.resolve(__dirname,'./public/index.js'))
// })


//监听端口号
server.listen(3000);
console.log('服务启动成功');