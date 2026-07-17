import { Request, Response } from "express";
import Employee from "../models/Employee";

export const getDashboardStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const stats = await Employee.aggregate([
      {
        $facet: {
          counts: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          departments: [{ $group: { _id: "$department" } }],
        },
      },
    ]);

    const statusCounts = stats[0]?.counts || [];
    const active =
      statusCounts.find((s: any) => s._id === "Active")?.count || 0;
    const inactive =
      statusCounts.find((s: any) => s._id === "Inactive")?.count || 0;
    const total = active + inactive;
    const departmentCount = stats[0]?.departments?.length || 0;

    res.status(200).json({ total, active, inactive, departmentCount });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats." });
  }
};
