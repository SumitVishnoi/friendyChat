import jwt from "jsonwebtoken";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(400).json({
        message: "User doesn't have valid token",
      });
    }

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(500).json({
      message: `isAuth error ${error}`,
    });
  }
};
