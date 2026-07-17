import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Avatar,
  Divider,
  Chip,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  SupervisorAccount as ManagerIcon,
} from "@mui/icons-material";
import api from "../services/api";
import type { Employee } from "../types";

export const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    api
      .get(`/employees/${id}`)
      .then((res) => {
        setEmployee(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load employee profile data.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress thickness={4} size={50} />
      </Box>
    );
  }

  if (error || !employee) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        {error || "Employee profile not found."}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" color="text.primary" sx={{ fontWeight: 800 }}>
          Employee Profile
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Personal identification documentation, corporate standing, and system
          metrics.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              textAlign: "center",
              p: 3,
              height: "100%",
            }}
          >
            <CardContent>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mx: "auto",
                  mb: 2.5,
                  bgcolor: "#2563eb",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                {employee.name[0]}
              </Avatar>
              <Typography
                variant="h6"
                color="text.primary"
                sx={{ fontWeight: 700, mb: 0.5 }}
              >
                {employee.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {employee.designation}
              </Typography>
              <Chip
                label={employee.status}
                color={employee.status === "Active" ? "success" : "error"}
                sx={{ fontWeight: 600, borderRadius: 1.5 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            sx={{
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              p: 2,
              height: "100%",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                color="text.primary"
                sx={{ fontWeight: 700, mb: 3 }}
              >
                Operational Information
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <BadgeIcon sx={{ color: "#2563eb" }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Employee ID
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        sx={{ fontWeight: 600 }}
                      >
                        {employee.employeeId}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <EmailIcon sx={{ color: "#2563eb" }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Email Address
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        sx={{ fontWeight: 600 }}
                      >
                        {employee.email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <PhoneIcon sx={{ color: "#2563eb" }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Phone Connection
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        sx={{ fontWeight: 600 }}
                      >
                        {employee.phone}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <BusinessIcon sx={{ color: "#2563eb" }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Department Assignment
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        sx={{ fontWeight: 600 }}
                      >
                        {employee.department}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <WorkIcon sx={{ color: "#2563eb" }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Access Clearances Role
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        sx={{ fontWeight: 600 }}
                      >
                        {employee.role}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <MoneyIcon sx={{ color: "#2563eb" }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Compensation Tier
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        sx={{ fontWeight: 600 }}
                      >
                        ${employee.salary.toLocaleString()} / year
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 4, borderColor: "divider" }} />

              <Typography
                variant="h6"
                color="text.primary"
                sx={{ fontWeight: 700, mb: 3 }}
              >
                Management Reporting
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <ManagerIcon sx={{ color: "success.main" }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Direct Line Manager
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    sx={{ fontWeight: 600 }}
                  >
                    {employee.reportingManager
                      ? employee.reportingManager.name
                      : "No supervisory reporting manager"}
                  </Typography>
                  {employee.reportingManager && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block" }}
                    >
                      {employee.reportingManager.email}
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
