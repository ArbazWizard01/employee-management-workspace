import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import type { Employee } from "../types";

export const Employees: React.FC = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error" as "error" | "success",
  });

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    salary: 0,
    role: "Employee",
    status: "Active",
    reportingManager: "",
  });

  const triggerToast = (message: string, severity: "error" | "success") => {
    setToast({ open: true, message, severity });
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (department) params.department = department;
      if (role) params.role = role;
      if (status) params.status = status;

      const response = await api.get("/employees", { params });
      setEmployees(response.data);
    } catch (err: any) {
      triggerToast("Failed to fetch employee database logs.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, department, role, status]);

  const handleOpenModal = (emp: Employee | null = null) => {
    if (emp) {
      setEditId(emp._id);
      setFormData({
        employeeId: emp.employeeId,
        name: emp.name,
        email: emp.email,
        phone: emp.phone,
        department: emp.department,
        designation: emp.designation,
        salary: emp.salary,
        role: emp.role,
        status: emp.status,
        reportingManager: emp.reportingManager?._id || "",
      });
    } else {
      setEditId(null);
      setFormData({
        employeeId: "",
        name: "",
        email: "",
        phone: "",
        department: "",
        designation: "",
        salary: 0,
        role: "Employee",
        status: "Active",
        reportingManager: "",
      });
    }
    setOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "salary" ? Number(value) : value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/employees/${editId}`, formData);
        if (formData.reportingManager) {
          await api.patch(`/employees/${editId}/manager`, {
            reportingManager: formData.reportingManager,
          });
        }
        triggerToast("Profile changes saved successfully.", "success");
      } else {
        const res = await api.post("/employees", formData);
        if (formData.reportingManager && res.data?._id) {
          await api.patch(`/employees/${res.data._id}/manager`, {
            reportingManager: formData.reportingManager,
          });
        }
        triggerToast("Employee account created successfully.", "success");
      }
      setOpen(false);
      fetchEmployees();
    } catch (err: any) {
      triggerToast(
        err.response?.data?.message ||
          "Transaction rejected by system parameters.",
        "error",
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this profile record?"))
      return;
    try {
      await api.delete(`/employees/${id}`);
      triggerToast("Employee record deleted.", "success");
      fetchEmployees();
    } catch (err: any) {
      triggerToast(err.response?.data?.message || "Action denied.", "error");
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            color="text.primary"
            sx={{ fontWeight: 800 }}
          >
            Employee Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Modify database records, update salaries, and adjust permissions.
          </Typography>
        </Box>
        {user?.role !== "Employee" && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
            sx={{
              bgcolor: "#2563eb",
              "&:hover": { bgcolor: "#1d4ed8" },
              py: 1,
              px: 2.5,
              borderRadius: 2,
            }}
          >
            Add Employee
          </Button>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
        <TextField
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <SearchIcon
                  sx={{ color: "text.secondary", mr: 1, fontSize: "1.2rem" }}
                />
              ),
            },
          }}
          sx={{ flexGrow: 1, minWidth: "240px" }}
        />
        <TextField
          select
          label="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          sx={{ minWidth: "160px" }}
        >
          <MenuItem value="">All Departments</MenuItem>
          <MenuItem value="Engineering">Engineering</MenuItem>
          <MenuItem value="IT">IT</MenuItem>
          <MenuItem value="HR">HR</MenuItem>
          <MenuItem value="Marketing">Marketing</MenuItem>
          <MenuItem value="Finance">Finance</MenuItem>
        </TextField>
        <TextField
          select
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          sx={{ minWidth: "150px" }}
        >
          <MenuItem value="">All Roles</MenuItem>
          <MenuItem value="Super Admin">Super Admin</MenuItem>
          <MenuItem value="HR Manager">HR Manager</MenuItem>
          <MenuItem value="Employee">Employee</MenuItem>
        </TextField>
        <TextField
          select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{ minWidth: "140px" }}
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </TextField>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}>
          <CircularProgress size={40} />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: "background.default" }}>
              <TableRow>
                <TableCell sx={{ color: "text.primary", fontWeight: 600 }}>
                  Employee ID
                </TableCell>
                <TableCell sx={{ color: "text.primary", fontWeight: 600 }}>
                  Name
                </TableCell>
                <TableCell sx={{ color: "text.primary", fontWeight: 600 }}>
                  Email
                </TableCell>
                <TableCell sx={{ color: "text.primary", fontWeight: 600 }}>
                  Department
                </TableCell>
                <TableCell sx={{ color: "text.primary", fontWeight: 600 }}>
                  Role
                </TableCell>
                <TableCell sx={{ color: "text.primary", fontWeight: 600 }}>
                  Status
                </TableCell>
                <TableCell sx={{ color: "text.primary", fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((emp) => (
                  <TableRow
                    key={emp._id}
                    sx={{ "&:hover": { bgcolor: "background.default" } }}
                  >
                    <TableCell sx={{ color: "text.primary", fontWeight: 500 }}>
                      {emp.employeeId}
                    </TableCell>
                    <TableCell sx={{ color: "text.primary", fontWeight: 600 }}>
                      {emp.name}
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {emp.email}
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {emp.department}
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {emp.role}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={emp.status}
                        size="small"
                        color={emp.status === "Active" ? "success" : "error"}
                        sx={{ fontWeight: 600, borderRadius: 1.5 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          sx={{ color: "primary.light" }}
                          onClick={() => handleOpenModal(emp)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        {user?.role === "Super Admin" && (
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(emp._id)}
                            sx={{ color: "error.main" }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={employees.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_e, p) => setPage(p)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            sx={{
              bgcolor: "background.paper",
              color: "text.secondary",
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          />
        </TableContainer>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              p: 1,
            },
          },
        }}
      >
        <form onSubmit={handleFormSubmit}>
          <DialogTitle sx={{ color: "text.primary", fontWeight: 700 }}>
            {editId ? "Modify System Profile" : "Register New Employee"}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", gap: 2, mt: 2, mb: 2 }}>
              <TextField
                required
                label="Employee ID"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                disabled={!!editId}
                fullWidth
              />
              <TextField
                required
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                required
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                required
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                fullWidth
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                select
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                fullWidth
              >
                <MenuItem value="Engineering">Engineering</MenuItem>
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
              </TextField>
              <TextField
                required
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                fullWidth
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                required
                label="Salary"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                select
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                fullWidth
              >
                <MenuItem value="Super Admin">Super Admin</MenuItem>
                <MenuItem value="HR Manager">HR Manager</MenuItem>
                <MenuItem value="Employee">Employee</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
              <TextField
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                fullWidth
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
              <TextField
                label="Reporting Manager ID"
                name="reportingManager"
                value={formData.reportingManager}
                onChange={handleInputChange}
                placeholder="Mongoose Object ID"
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => setOpen(false)}
              sx={{ color: "text.secondary" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: "#2563eb" }}
            >
              Save Profile
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Employees;
