import Chat from "../models/chat.js";
import User from "../models/user.js";

const getRecentChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const senders = await Chat.distinct("sender", { receiver: userId });
    const receivers = await Chat.distinct("receiver", { sender: userId });
    const uniqueUsers = [
      ...new Set([
        ...senders.map((sender) => sender.toString()),
        ...receivers.map((receiver) => receiver.toString()),
      ]),
    ];
    const allChats = await Promise.all(
      uniqueUsers.map(async (user) => {
        const chat = await Chat.findOne({
          $or: [
            { sender: user, receiver: userId },
            { sender: userId, receiver: user },
          ],
        })
          .sort({ createdAt: -1 })

        const userDetails = await User.findById(user).select("name");
        const chatData = {
          chat:chat.chat,
          sender:chat.sender,
          receiver:chat.receiver,
          isRead:chat.isRead,
          time:chat.createdAt,
          _id: userDetails._id,
          name: userDetails.name,
        };
        return chatData;
      })
    );
    return res.status(200).json({ success: true, recentChats: allChats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error, please try again" });
  }
};

const sendChat = async (req, res) => {
  try {
    const { receiver, chat } = req.body;
    const sender = req.user.id;

    await Chat.create({
      sender,
      receiver,
      chat,
    });

    const count = await Chat.find({
      sender,
      receiver,
      isRead: false,
    }).countDocuments();

    const user = await User.findById(sender).select("name");
    req.io.emit("chatNotification", {
      members: [receiver],
      message: `${count} new messages from ${user.name}`,
    });

    res.status(200).json({ message: "Message send successfullt" });
  } catch (error) {
    res.status(400).json({ message: "Failed to send message" });
  }
};

const getAllChats = async (req, res) => {
  try {
    const { userId } = req.params;
    const myId = req.user.id;

    if (!userId || !myId) {
      return res.status(400).json({ error: "User ID or authentication is missing" });
    }

    // Retrieve the chats
    const chats = await Chat.find({
      $or: [
        { sender: myId, receiver: userId },
        { sender: userId, receiver: myId },
      ],
    });

    res.status(200).json({ success: true, chats });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Internal server error" });
  }
};


const markAsReadChats = async (req, res) => {
  const { userId } = req.params;
  const myId = req.user.id;

  await Chat.updateMany(
    {
      sender: userId,
      receiver: myId,
      isRead: false,
    },
    {
      $set: { isRead: true },
    }
  );

  res.status(200).json({ success: true });
};

export { getAllChats, sendChat, getRecentChats, markAsReadChats };
