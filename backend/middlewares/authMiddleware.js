import jwt from "jsonwebtoken";
import Company from "../models/Company.js";
import User from "../models/User.js";

export const protectCompany = async (req, res, next) => {
  const token = req.headers.token;
  if (!token)
    return res.status(401).json({ success: false, message: "Unauthorized!" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.company = await Company.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Error in verifying company", error });
  }
};

export const protectCandidate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded.role !== "candidate") {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: candidate access only" });
    }
    req.user = await User.findById(decoded.id).select("-password");
    req.userId = decoded.id; // drop-in replacement for req.auth.userId
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
