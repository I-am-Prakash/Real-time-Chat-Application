import JsonWebToken from "jsonwebtoken";
import User from "../models/user.model";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookie.jwt;
    if (!token) return res.status(401).send("Unauthorized");
    const decodedToken = JsonWebToken.verify(token, process.env.JWT_SECRET);
    console.log("decodedToken ", decodedToken);
    if (!decodedToken)
      return res.status(401).send("Not Authorized - Invalid token");
    const user = await User.findById({ _id: decodedToken.user_id }).select(
      "-password"
    );
    if (!user) return res.status(404).send("User not found");
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in user Authorization middleware ", error.message);
    res.status(500).send("Internal Server Error");
  }
};
