const express = require('express');
const app = express();
const router = express.Router();
const mysql = require('mysql');


// jwt 라이브러리
const jwt = require('jsonwebtoken');

const options = {
	host: process.env.MYSQL_HOSTNAME,
	user: process.env.MYSQL_USERID,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE
};

router.get('/', function(req, res) {
	console.log(req.cookies);
	if (req.headers.cookie !== undefined) {
		//console.log(req.cookies.testcookie);
		//const [, isLogin] = req.headers.cookie.split('=');
		//const msg = 'login 실패';
	
		//res.render('index.html', { user, isLogin, msg });
	  }
	//console.log(isLogin);
	// if(req.session.isLogined) {
	// 	res.redirect('/');
	// }
	// else {
		res.render('login', {
			'http_port': http_port,
			'http_hostname': http_hostname
		});
	// }
});

router.post('/', function(req, res) {
	var oRet = {'bRst':false, 'sMsg':''}
	const name = req.body.name;
	if(!name.length)
	{
		oRet.sMsg = 'invalid name';
		res.json(oRet);
		return;
	}
	const pw = req.body.pw;
	if(!pw.length)
	{
		oRet.sMsg = 'invalid pw';
		res.json(oRet);
		return;
	}

	const connection = mysql.createConnection(options);
	connection.connect();
	connection.query('select * from user_info where name=?', [name], function(err, rows) {
		if(err) throw err;
		if(rows.length) {
			if(rows[0].pw === pw){
				const key = process.env.JWT_SECRET_KEY;
				// 받은 요청에서 db의 데이터를 가져온다 (로그인정보)
				const s_name = rows[0].name;
				const s_profile = "images";
				let token = "";
				// jwt.sign(payload, secretOrPrivateKey, [options, callback])
				token = jwt.sign({
						type: "JWT",
						name: s_name,
						profile: s_profile,
					},
					key,
					{
						expiresIn: "15s", // 15분후 만료
						issuer: "토큰발급자",
					});
				// req.session.uname = rows[0].name;
				// req.session.upw = rows[0].pw;
				// req.session.isLogined = true;
				// req.session.save(err => {
				// 	if(err){
				// 		console.log(err);
				// 	}
					// oRet.bRst = true;
					// oRet.sMsg = 'ok';
					// res.json(oRet);
					//res.redirect("/");
					
				// response
				res.writeHead(200, {'Set-cookie':[`Authorization=${token}`]});
				res.end('Cookie!!');
				// res.cookie('Authorization', token, {
				// 	maxAge: 600000, //1000 * 60 * 10, 
					
				// });
				//console.log(token);
		   
				// return res.status(200).json({
				// 	code: 200,
				// 	message: "token is created",
				// 	token: token,
				// });
				// });	
				//console.log(req.session);
				return;
			} else {
				oRet.sMsg = 'invalid pw';
				res.json(oRet);
				return;
			}
		}
		else{
			oRet.sMsg = 'invalid id';
			res.json(oRet);
			return;
		}
	});
});

module.exports = router;