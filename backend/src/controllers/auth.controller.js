import { generateJWTToken } from "../appLib/authHelper.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).send("All fields are required");
    }
    if (password.length < 8) {
      return res
        .status(400)
        .send("Password must be at least 8 characters long");
    }
    //   check if user already exist trying to signup
    const user = await User.findOne({ email });
    if (user) return res.status(400).send("User already exist");
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({ name, email, password: hashPassword });
    if (newUser) {
      // generate JWT Token and stores in response as a HTTP only cookie(Can't be accessed via JS) - Helps avoid XSS(Cross Site Scripting) attacks
      generateJWTToken(newUser._id, res);
      await newUser.save();
      res.status(201).send("User created successfully");
    } else {
      res.status(400).send("Invalid user");
    }
  } catch (error) {
    console.log("Error while signing up", error);
    res.status(500).send("Internal Server Error");
  }
};

export const login = (req, res) => {
  res.send("Welcome to Login page");
};

export const logout = (req, res) => {
  res.send("Welcome to Logout page");
};
