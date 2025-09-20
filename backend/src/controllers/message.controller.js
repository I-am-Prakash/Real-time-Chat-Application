import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../appLib/cloudinary.js";

// Get All users Except current logged in user
export const getAllUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const AllUsers = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );
    return res.status(200).json(AllUsers);
  } catch (error) {
    console.log("Error while getting all users ", error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getConversation = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const currentUser = req.user._id;
    const messages = await Message.find({
      $or: [
        { sender_id: currentUser, receiver_id: receiverId },
        { sender_id: receiverId, receiver_id: currentUser },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error while getting Conversation ", error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageURL;
    if (image) {
      // upload base64 image to cloudinary
      const uploadRes = await cloudinary.uploader.upload(image);
      imageURL = uploadRes.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageURL,
    });

    await newMessage.save();

    // Real Time Functionality using => socket.io

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error while sending message ", error.message);
    res.status(500).send("Internal Server Error");
  }
};
