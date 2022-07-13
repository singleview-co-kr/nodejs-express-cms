const session = require('express-session');
const express = require('express');
const app = express();
const router = express.Router();
const mysql = require('mysql');

const options = {
	host: process.env.MYSQL_HOSTNAME,
	user: process.env.MYSQL_USERID,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE
};

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
			connection.query('update user_info set pw=? where name=?', [pw, name], function(err, rows) {
				if(err) throw err;
			});
			req.session.uname = rows[0].name;
			req.session.upw = rows[0].pw;
			req.session.isLogined = true;
			req.session.save(err => {
				if(err){
					console.log(err);
				}
				oRet.bRst = true;
				oRet.sMsg = 'ok';
				res.json(oRet);
				//res.redirect("/");
			});
			//console.log(req.session);
			return;
		}
		else{
			oRet.sMsg = 'invalid id';
			res.json(oRet);
			return;
		}
	});
});

module.exports = router;