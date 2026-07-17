import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Employee from "../models/Employee";
import { isCircularReporting } from "../utils/hierarchy";

export const createEmployee = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, password, employeeId, reportingManager, role } = req.body;

    if (req.user?.role === "HR Manager" && role === "Super Admin") {
      res
        .status(403)
        .json({ message: "HR Managers cannot create Super Admin accounts." });
      return;
    }

    const existingEmail = await Employee.findOne({ email });
    const existingId = await Employee.findOne({ employeeId });
    if (existingEmail || existingId) {
      res.status(400).json({ message: "Employee ID or Email already exists." });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password || "welcome123", salt);

    const employeeData = { ...req.body, passwordHash };
    if (!reportingManager) employeeData.reportingManager = null;

    const employee = new Employee(employeeData);
    await employee.save();

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Error creating employee." });
  }
};

export const getAllEmployees = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { search, department, role, status, sortBy, sortOrder } = req.query;
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: "i" } },
        { email: { $regex: search as string, $options: "i" } },
      ];
    }
    if (department) query.department = department as string;
    if (role) query.role = role as string;
    if (status) query.status = status as string;

    const sortOption: any = {};
    if (sortBy) {
      sortOption[sortBy as string] = sortOrder === "desc" ? -1 : 1;
    } else {
      sortOption.joiningDate = 1;
    }

    const employees = await Employee.find(query)
      .populate("reportingManager", "name email")
      .sort(sortOption);

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees." });
  }
};

export const getEmployeeById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (req.user?.role === "Employee" && req.user.id !== id) {
      res.status(403).json({
        message: "Access denied. You can only view your own profile.",
      });
      return;
    }

    const employee = await Employee.findById(id).populate(
      "reportingManager",
      "name email",
    );
    if (!employee) {
      res.status(404).json({ message: "Employee not found." });
      return;
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee details." });
  }
};

export const updateEmployee = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    let updateData = { ...req.body };

    if (req.user?.role === "Employee") {
      if (req.user.id !== id) {
        res.status(403).json({
          message: "Access denied. You can only edit your own profile.",
        });
        return;
      }

      const allowedFields = ["phone", "profileImage", "password"];
      const filteredData: any = {};
      allowedFields.forEach((field) => {
        if (updateData[field] !== undefined)
          filteredData[field] = updateData[field];
      });

      if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        filteredData.passwordHash = await bcrypt.hash(
          updateData.password,
          salt,
        );
      }
      updateData = filteredData;
    }

    if (req.user?.role === "HR Manager" && updateData.role === "Super Admin") {
      res
        .status(403)
        .json({ message: "HR Managers cannot assign the Super Admin role." });
      return;
    }

    const employee = await Employee.findById(id);
    if (!employee) {
      res.status(404).json({ message: "Employee not found." });
      return;
    }

    if (
      updateData.reportingManager &&
      updateData.reportingManager !== employee.reportingManager?.toString()
    ) {
      const circular = await isCircularReporting(
        id,
        updateData.reportingManager,
      );
      if (circular) {
        res
          .status(400)
          .json({ message: "Circular reporting configuration detected." });
        return;
      }
    }

    const updated = await Employee.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating employee." });
  }
};

export const deleteEmployee = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;

    await Employee.updateMany({ reportingManager: id as any }, {
      reportingManager: null,
    } as any);
    const deleted = await Employee.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ message: "Employee not found." });
      return;
    }
    res.status(200).json({ message: "Employee deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee." });
  }
};

export const updateManager = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { reportingManager } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid Employee ID format." });
      return;
    }

    if (
      reportingManager &&
      !mongoose.Types.ObjectId.isValid(reportingManager)
    ) {
      res.status(400).json({ message: "Invalid Reporting Manager ID format." });
      return;
    }

    const circular = await isCircularReporting(id, reportingManager as string);
    if (circular) {
      res
        .status(400)
        .json({ message: "Circular reporting configuration detected." });
      return;
    }

    const updated = await Employee.findByIdAndUpdate(
      id,
      { reportingManager: (reportingManager || null) as any },
      { new: true },
    );

    if (!updated) {
      res.status(404).json({ message: "Employee not found." });
      return;
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Update Manager Error:", error);
    res.status(500).json({ message: "Error updating manager." });
  }
};

export const getDirectReports = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const reports = await Employee.find({ reportingManager: id as any });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error getting direct reportees." });
  }
};

export const getOrgTree = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const employees = await Employee.find(
      {},
      "name designation reportingManager email status",
    );

    const buildTree = (managerId: string | null): any[] => {
      return employees
        .filter((emp) => String(emp.reportingManager) === String(managerId))
        .map((emp) => ({
          key: emp._id.toString(),
          title: `${emp.name} (${emp.designation})`,
          email: emp.email,
          status: emp.status,
          children: buildTree(emp._id.toString()),
        }));
    };

    const treeData = buildTree(null);
    res.status(200).json(treeData);
  } catch (error) {
    res.status(500).json({ message: "Error generating organizational tree." });
  }
};
