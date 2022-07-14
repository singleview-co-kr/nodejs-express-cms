const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
	// console.log(req.session);
	// if(req.session.isLogined) {
	// 	res.render('member_info', {
	// 		'u_name': req.session.uname,
	// 		'u_pw': req.session.upw
	// 	});
	// }
	//else {
	{
		res.render('main', {
			'http_port': http_port,
			'http_hostname': http_hostname
		});
	}
});

module.exports = router;