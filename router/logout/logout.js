const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
	req.session.destroy(err => {
        if (err) {
            console.log(error);
            return res.status(500).send("<h1>500 error</h1>");
        }
        res.redirect("/");
    });
});

module.exports = router;