export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'HR Manager' | 'Employee';
}

export interface Employee {
  _id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  joiningDate: string;
  status: 'Active' | 'Inactive';
  role: 'Super Admin' | 'HR Manager' | 'Employee';
  reportingManager: { _id: string; name: string; email: string } | null;
  profileImage?: string;
}

export interface DashboardStats {
  total: number;
  active: number;
  inactive: number;
  departmentCount: number;
}