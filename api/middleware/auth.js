import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// 토큰 체크하기
export const protectRoute = async (req, res, next) => {
  const token = req.cookies.jwt;
  try {
    // 토큰이 없는경우
    if (!token) {
      console.log("TOKEN IS NOT EXISTED");
      return res
        .status(400)
        .send({ success: false, message: "TOKEN IS NOT EXISTED" });
    }
    // 디코드 비교
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    if (!decoded) {
      console.log("Decoded Token is not matched");
      return res
        .status(400)
        .send({ success: false, message: "DECODED CODE IS WRONG" });
    }
    // 사인한 요소 그대로찾아주기
    const currentUser = await User.findById(decoded.id);
    req.user = currentUser;
    // 다음 미들웨어로 넘김
    next();
  } catch (error) {
    console.log("TOKEN VERIFICATION IS ERROR ", error.message);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "NOT AUTHORIZED - Invalid token",
      });
    } else {
      return res
        .status(401)
        .send({ success: false, message: "Fail to verify the Token" });
    }
  }
};
