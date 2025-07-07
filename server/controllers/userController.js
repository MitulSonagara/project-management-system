import Project from "../models/project.js";
import User from "../models/user.js";

const getAllUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    const allUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );
    res.status(200).json({ success: true, allUsers });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getProjectMembers = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId).populate(
      "teamMembers",
      "_id name"
    );
    const teamMembers = project.teamMembers;
    res.status(200).json({ success: true, teamMembers });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export { getAllUsers, getProjectMembers };
