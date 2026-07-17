import { Schema, model, Document } from "mongoose";

export interface IEmployee extends Document {
  employeeId: string;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  joiningDate: Date;
  status: "Active" | "Inactive";
  role: "Super Admin" | "HR Manager" | "Employee";
  reportingManager: Schema.Types.ObjectId | null;
  profileImage?: string;
}

const EmployeeSchema = new Schema<IEmployee>(
  {
    employeeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    salary: { type: Number, required: true },
    joiningDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    role: {
      type: String,
      enum: ["Super Admin", "HR Manager", "Employee"],
      default: "Employee",
    },
    reportingManager: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    profileImage: { type: String },
  },
  { timestamps: true },
);

export default model<IEmployee>("Employee", EmployeeSchema);
