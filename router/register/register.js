require('dotenv').config();
const express = require('express');
const router = express.Router();
const mysql = require('mysql');

router.get('/', function(req, res) {
	if(req.session.isLogined) {
		res.redirect('/');
	}
	else {
		res.render('register', {
			'http_port': http_port,
			'http_hostname': http_hostname
		});
	}
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
	const connection = mysql.createConnection({
		host: process.env.MYSQL_HOSTNAME,
		user: process.env.MYSQL_USERID,
		password: process.env.MYSQL_PASSWORD,
		database: process.env.MYSQL_DATABASE
	});
	connection.connect();
	var sql_insert = {name: name, pw: pw};
	connection.query('select name from user_info where name=?', [name], function(err, rows) {
		if(rows.length) {
			oRet.sMsg = 'duplicated name';
			res.json(oRet);
			return;
		} else {
			connection.query('insert into user_info set?', sql_insert, function(err, rows) {
				if(err) throw err;
				console.log('ok');
				oRet.bRst = true;
				oRet.sMsg = 'name registerted';
				res.json(oRet);
				return;
			});
		}
	});
});
module.exports = router