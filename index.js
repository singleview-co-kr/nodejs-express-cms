// https://wjswhdgur123.tistory.com/m/57
require('dotenv').config();

// init HTTP server via global var
// refer to https://lahuman.github.io/nodejs_global/
global.http_port = process.env.HTTP_PORT || 4500;
global.http_hostname = process.env.HTTP_HOSTNAME || '127.0.0.1';

// node js 의 핵심 모듈인 http와 connect 컴포넌트를 기반으로하는 빠르고 간편한 웹 프레임워크
const express = require('express');
const session = require('express-session');
//const mongoose = require('mongoose');
// post로 들어오는 정보들을 받기위한 모듈
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const mySqlStorage = require('express-mysql-session')(session);
const mysql = require('mysql');

const app = express();

// init ejs tmplate engine
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// https://yohanpro.com/posts/nodejs/express-session
// begin - mysql session storage config
const options = {
	host: process.env.MYSQL_HOSTNAME,
	user: process.env.MYSQL_USERID,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE
};

//var sessionConnection = mysql.createConnection(options);
// var sessionStore = new mySqlStorage({
//     expiration: 10800000,
//     createDatabaseTable: true,
//     schema: {
//         tableName: 'USERS_SESSIONS',
//         columnNames: {
//             session_id: 'session_id',
//             expires: 'expires',
//             data: 'data'
//         }
//     }
// }, sessionConnection);

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', '*');
	if (req.method === 'OPTIONS') {
	  return res.sendStatus(200);
	}
	next();
  });
  
app.use(cookieParser('secret@1234'));
// app.use(session({
//     secret: 'secret@1234',
//     resave: false,
//     saveUninitialized: true,
//     cookie:{
//         httpOnly: true,
//     },
//     // name: 'connect.sid'
// }));

// 토큰검증 미들웨어
const mw = require('./middleware/authMiddleware'); 
app.use(mw.auth);

// // app.use()를 다른 미들웨어를 사용하기 전에 미리 선언해두어야 별 지장없이 사용
// app.use(session({
// 	key: '69Atu22GZTSyDGW4sf4mMJdJ42436gAs',
// 	secret: '3dCE84rey8R8pHKrVRedgyEjhrqGT5Hz',
// 	store: sessionStore,
// 	resave: false,  // enforce saving even if no change when new request
// 	saveUninitialized: true, // enforcce saving even if no contents
// 	cookie: {
// 		// options for session cookie, httpOnly, expires, domain, path, secure, sameSite
// 		httpOnly: true, // forbid access via JS
// 	}
// 	// name: 'connect.sid'  // default name for session cookie is connect.sid
// }));
// end - mysql-session

// init express config

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Node의 native Promise 사용
//mongoose.Promise = global.Promise;

// CONNECT TO MONGODB SERVER
//mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
//  .then(() => console.log('Successfully connected to mongodb'))
//  .catch(e => console.error(e));

// ROUTERS
const router = require('./router/index');
app.use(router);

app.listen(http_port, () => console.log(`Server listening on port ${http_port}`));