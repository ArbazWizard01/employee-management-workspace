import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  People as GroupIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Business as DeptIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import type { DashboardStats } from "../types";

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role === "Employee") return;

    api
      .get("/dashboard/stats")
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load metric dashboard data.");
        setLoading(false);
      });
  }, [user]);

  if (user?.role === "Employee") {
    return <Navigate to={`/profile/${user.id}`} replace />;
  }

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

  if (error)
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        {error}
      </Alert>
    );

  const statCards = [
    {
      title: "Total Employees",
      value: stats?.total || 0,
      icon: <GroupIcon sx={{ fontSize: 28, color: "#2563eb" }} />,
    },
    {
      title: "Active Staff",
      value: stats?.active || 0,
      icon: <ActiveIcon sx={{ fontSize: 28, color: "#10b981" }} />,
    },
    {
      title: "Inactive Staff",
      value: stats?.inactive || 0,
      icon: <InactiveIcon sx={{ fontSize: 28, color: "#f43f5e" }} />,
    },
    {
      title: "Departments",
      value: stats?.departmentCount || 0,
      icon: <DeptIcon sx={{ fontSize: 28, color: "#0ea5e9" }} />,
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, color: "text.primary" }}
          gutterBottom
        >
          Metrics Overview
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Real-time resource distributions and status updates.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {statCards.map((card, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
            <Card
              sx={{
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                boxShadow: "none",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: "text.secondary" }}
                  >
                    {card.title}
                  </Typography>
                  <Box
                    sx={{
                      p: 1,
                      bgcolor: "background.default",
                      borderRadius: 2,
                      display: "flex",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 800, color: "text.primary" }}
                >
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
