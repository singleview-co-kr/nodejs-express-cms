//import jwt from "jsonwebtoken";
//import dotenv from "dotenv";
//dotenv.config();
const jwt = require('jsonwebtoken');
// env환경변수 라이브러리
require('dotenv').config();

var cookie = require('cookie');

//export const auth = (req, res, next) => {
exports.auth = function(req, res, next) {
//export default function(req, res, next) {
  const key = process.env.JWT_SECRET_KEY;
  // 인증 완료
  try {
    // 요청 헤더에 저장된 토큰(req.headers.authorization)과 비밀키를 사용하여 토큰을 req.decoded에 반환
	// console.log(req.headers.cookie);
  let cookies = {};
  if(req.headers.cookie !== undefined){
    cookies = cookie.parse(req.headers.cookie);
  }
  console.log(cookies.Authorization);

    req.decoded = jwt.verify(cookies.Authorization, key);
    console.log(req.decoded);
    return next();
  } catch (error) {
    // 인증 실패
    // 유효시간이 초과된 경우
    if (error.name === "TokenExpiredError") {
      res.cookie('Authorization', '', {maxAge:0}); // unset JWT cookie
      // return res.status(419).json({
      //   code: 419,
      //   message: "expired token",
      // });
      return next();
    }
    // 토큰의 비밀키가 일치하지 않는 경우
    if (error.name === "JsonWebTokenError") {
      // return res.status(401).json({
      //   code: 401,
      //   message: "invalid token",
      // });
      return next();
    }
  }
};