import React from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  Avatar,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Dashboard as DashIcon,
  People as PeopleIcon,
  AccountTree as TreeIcon,
  Person as ProfileIcon,
  Logout as LogoutIcon,
  LightMode,
  DarkMode,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useCustomTheme } from "../context/CustomThemeContext";

const drawerWidth = 260;

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useCustomTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashIcon />,
      path: "/",
      roles: ["Super Admin", "HR Manager"],
    },
    {
      text: "Employees",
      icon: <PeopleIcon />,
      path: "/employees",
      roles: ["Super Admin", "HR Manager"],
    },
    {
      text: "Organization Tree",
      icon: <TreeIcon />,
      path: "/organization",
      roles: ["Super Admin", "HR Manager"],
    },
    {
      text: "My Profile",
      icon: <ProfileIcon />,
      path: `/profile/${user?.id}`,
      roles: ["Super Admin", "HR Manager", "Employee"],
    },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(user?.role || ""),
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: mode === "dark" ? "#1e293b" : "#e2e8f0",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            Workspace Console
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <IconButton
              onClick={toggleTheme}
              color="inherit"
              sx={{ color: "text.secondary" }}
            >
              {mode === "dark" ? <LightMode /> : <DarkMode />}
            </IconButton>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: "bold", color: "text.primary" }}
                >
                  {user?.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "block", color: "text.secondary" }}
                >
                  {user?.role}
                </Typography>
              </Box>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  fontWeight: "bold",
                  color: "#ffffff",
                }}
              >
                {user?.name[0]}
              </Avatar>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: mode === "dark" ? "#090f1c" : "background.paper",
            color: "text.primary",
            borderRight: "1px solid",
            borderColor: mode === "dark" ? "#1e293b" : "#e2e8f0",
          },
        }}
      >
        <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              bgcolor: "#2563eb",
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              color: "#ffffff",
            }}
          >
            P
          </Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "text.primary" }}
          >
            Playstack EMS
          </Typography>
        </Box>
        <Divider sx={{ bgcolor: mode === "dark" ? "#1e293b" : "#e2e8f0" }} />

        <List
          sx={{
            px: 2,
            py: 3,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            flexGrow: 1,
          }}
        >
          {filteredMenu.map((item) => {
            const active = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 1.5,
                  color: active ? "#ffffff" : "text.secondary",
                  bgcolor: active ? "#2563eb" : "transparent",
                  "&:hover": {
                    bgcolor: active
                      ? "#1d4ed8"
                      : mode === "dark"
                        ? "#0f172a"
                        : "#f1f5f9",
                    color: active ? "#ffffff" : "text.primary",
                  },
                  "& .MuiListItemIcon-root": { color: "inherit" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: active ? 600 : 500 }}
                    >
                      {item.text}
                    </Typography>
                  }
                />
              </ListItemButton>
            );
          })}
        </List>

        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={() => {
              logout();
              navigate("/login");
            }}
            sx={{
              bgcolor: mode === "dark" ? "#0f172a" : "#ffe4e6",
              color: "#f43f5e",
              "&:hover": { bgcolor: "#e11d48", color: "#ffffff" },
            }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          mt: 8,
          width: `calc(100% - ${drawerWidth}px)`,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
