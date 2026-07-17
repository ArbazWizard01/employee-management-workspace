import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Employee from "../models/Employee";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });
    if (!employee || employee.status === "Inactive") {
      res
        .status(400)
        .json({ message: "Invalid credentials or inactive account." });
      return;
    }

    const isMatch = await bcrypt.compare(password, employee.passwordHash);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials." });
      return;
    }

    const token = jwt.sign(
      { id: employee._id, role: employee.role },
      process.env.JWT_SECRET || '',
      { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
    );

    res.status(200).json({
      token,
      user: {
        id: employee._id,
        name: employee.name,
        role: employee.role,
        email: employee.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login." });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res
    .status(200)
    .json({
      message: "Logged out successfully. Remove token from frontend client.",
    });
};
