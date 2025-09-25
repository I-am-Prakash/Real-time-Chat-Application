import { generateJWTToken } from "../appLib/authHelper.js";
import cloudinary from "../appLib/cloudinary.js";
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

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("email :", email);
    console.log("Password :", password);
    const user = await User.findOne({ email });
    console.log("User :", user);

    if (!user) return res.status(400).send("Invalid Credentials");

    const isPasswordRight = await bcrypt.compare(password, user.password);
    if (!isPasswordRight) return res.status(400).send("Invalid Credentials");
    generateJWTToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      message: "Logged in Successfully",
    });
  } catch (error) {
    console.log("Error while logging in", error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      message: "You are successfully Logged out",
    });
  } catch (error) {
    console.log("Error while logging out", error);
    res.status(500).send("Internal Server Error");
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) return res.status(400).send("Profile Picture is Required");

    const uploadRes = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadRes.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error while updating profile", error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const checkAuthentication = (req, res) => {
  try {
    // just send user back to client the Authentcated user
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error while checking user authentication", error.message);
    res.status(500).send("Internal Server Error");
  }
};
