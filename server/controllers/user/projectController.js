import Project from "../../models/project.js";
import Task from "../../models/task.js";

const getAllProjects = async (req, res) => {
  try {
    const { userId } = req.params;
    const projects = await Project.find({
      teamMembers: { $in: [userId] },
      isActive: true,
    })
      .populate({ path: "createdBy", select: "name email" })
      .populate({ path: "projectManager", select: "name email" })
      .sort({ createdAt: -1 });

    const projectsWithProgress = await Promise.all(
      
      projects.map(async (project) => {
        // Count the total tasks for the project
        const totalTasks = await Task.countDocuments({
          projectId: project._id,
          isActive: true,
        });

        // Count the completed tasks for the project
        const completedTasks = await Task.countDocuments({
          projectId: project._id,
          state: "Completed",
          isActive: true,
        });

        // Calculate progress as a percentage
        const progress =
          totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        const roundedProgress = progress.toFixed(0);

        // Add the progress to the project object
        return { ...project.toObject(), progress: roundedProgress };
      })
    );

    res.json({ success: true, projects: projectsWithProgress });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export { getAllProjects };