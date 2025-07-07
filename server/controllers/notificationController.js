import Notification from "../models/notifications.js"

const clearNotifications = async (req, res) => {
    const { userId } = req.body;
    await Notification.updateMany(
        { userId: userId },
        { $set: { status: 0 } }
    )
    res.json({ success: true });
}

const markAsReadNotifications = async (req, res) => {
    const { userId } = req.body;
    await Notification.updateMany(
        { userId: userId, status:{$ne:0} },
        { $set: { status: 2 } },
    )
    const notifications = await Notification.find({
        userId: userId,
        status: {$ne: 0},
    }).populate("userId").sort({ createdAt: -1 });
    
    res.json({ success: true, notifications })
}

const fetchNotifications = async (req, res) => {
    const { userId } = req.params;

    const notifications = await Notification.find({
        userId: userId,
        status: {$ne: 0},
    }).populate("userId").sort({ createdAt: -1 });

    const count = await Notification.find({
        userId:userId,
        status: 1,
    }).countDocuments();
    res.status(200).json({success:true, notifications, count})
}

export { clearNotifications, markAsReadNotifications, fetchNotifications }