import jwt from "jsonwebtoken";
import {User} from "../models/index.model.js"

export const authenticate = async (req, res, next) => {
  console.log("Cookies received in request:", req.cookies);

  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No Token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    req.user = { userId: user._id, email: user.email, role: user.role };
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Unauthorized - Invalid Token" });
  }
};


export default authenticate;