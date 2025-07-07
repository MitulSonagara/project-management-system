// Assuming you have a Column model to get column names
import mongoose from "mongoose";
import Task from "../../models/task.js";

export const getTaskCountPerColumn = async (req, res) => {
    const {projectId}=req.params;

    const objectId =new mongoose.Types.ObjectId(projectId)
  try {
    const result = await Task.aggregate([
      // Step 1: Lookup the columns to get the column names

      {
        $match:{projectId:objectId,isActive:true}
      },

      {
        $lookup: {
          from: "columns",  // assuming the column collection is named "columns"
          localField: "columnId",
          foreignField: "_id",
          as: "column"
        }
      },
      // Step 2: Unwind the column array to get the column name
      {
        $unwind: "$column"
      },
      // Step 3: Group by columnId and count the tasks in each column
      {
        $group: {
          _id: "$column._id",  // Grouping by column ID
          count: { $sum: 1 }   // Count the number of tasks in each group
        }
      },
      // Step 4: Sort by column name (optional)
      {
        $sort: { "_id": 1 }
      },
      // Step 5: Lookup to get column name in the final result
      {
        $lookup: {
          from: "columns",  // again using columns collection
          localField: "_id",
          foreignField: "_id",
          as: "columnName"
        }
      },
      // Step 6: Unwind to extract the column name
      {
        $unwind: "$columnName"
      },
      // Step 7: Project the result to match your format
      {
        $project: {
          _id: 0,
          count: 1,
          columnName: "$columnName.name"  // assuming columns have a "name" field
        }
      }
    ]);

    const high = await Task.countDocuments({
        isActive:true,
        projectId:objectId,
        priority:"High"
    })

    const medium = await Task.countDocuments({
        isActive:true,
        projectId:objectId,
        priority:"Medium"
    })

    const low = await Task.countDocuments({
        isActive:true,
        projectId:objectId,
        priority:"Low"
    })

    // Map the result to get the "series" and "label" format
    const response = {
      series: result.map(item => item.count),
      label: result.map(item => item.columnName),
      priority: [high,medium,low],
    };

    res.json({success:true,data:response})
  } catch (error) {
    console.error("Error in aggregation:", error);
    return null;
  }
};
