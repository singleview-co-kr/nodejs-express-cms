// https://velog.io/@sjy0917/Express%EB%A1%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-JWT
const express = require('express');
const router = express.Router();

// 토큰검증 미들웨어
const mw = require('../../middleware/authMiddleware');

router.get('/', mw.auth, (req, res) => {
	// console.log(req.session);
	const s_name = req.decoded.name;
	const s_profile = req.decoded.profile;
	console.log(s_name);
	console.log(s_profile);
});

module.exports = router;