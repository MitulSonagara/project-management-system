import ActivityLog from "../models/activityLog.js";

export const fetchActivityLogs = async (req, res) => {
  const { projectId } = req.params;

  try {
    const activity = await ActivityLog.find({projectId:projectId}).populate("userId","name");

    return res.status(201).json({ success: true, activityLogs: activity });
  } catch {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch activities" });
  }
};
