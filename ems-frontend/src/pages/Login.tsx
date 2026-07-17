import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;
      login(token, user);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#030712",
        background:
          "radial-gradient(circle at 50% 50%, #0f172a 0%, #030712 100%)",
        p: 3,
      }}
    >
      <Card
        sx={{
          maxWidth: 440,
          width: "100%",
          borderRadius: 4,
          bgcolor: "#090f1c",
          border: "1px solid #1e293b",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
        }}
      >
        <CardContent sx={{ p: { xs: 4, sm: 5 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 4,
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                bgcolor: "#2563eb",
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                color: "#ffffff",
                fontSize: "1rem",
              }}
            >
              P
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: "0.02em",
                color: "#ffffff",
              }}
            >
              Playstack EMS
            </Typography>
          </Box>

          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.02em",
                mb: 1,
              }}
            >
              Employee Portal
            </Typography>
            <Typography variant="body2" sx={{ color: "#94a3b8" }}>
              Sign in to manage your profile, team, and organizational
              hierarchy.
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  bgcolor: "#2d1416",
                  color: "#f87171",
                  border: "1px solid #7f1d1d",
                  "& .MuiAlert-icon": { color: "#f87171" },
                }}
              >
                {error}
              </Alert>
            )}

            <Box sx={{ mb: 2.5 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "#94a3b8", mb: 1 }}
              >
                Email Address
              </Typography>
              <TextField
                required
                fullWidth
                id="email"
                name="email"
                autoComplete="email"
                autoFocus
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                slotProps={{
                  input: {
                    sx: {
                      color: "#ffffff",
                      bgcolor: "#030712",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1e293b",
                      },
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "#94a3b8", mb: 1 }}
              >
                Password
              </Typography>
              <TextField
                required
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{
                  input: {
                    sx: {
                      color: "#ffffff",
                      bgcolor: "#030712",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1e293b",
                      },
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          sx={{ color: "#94a3b8" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                py: 1.6,
                borderRadius: 2.5,
                fontSize: "0.9rem",
                fontWeight: 600,
                bgcolor: "#2563eb",
                color: "#ffffff",
                boxShadow: "0 4px 14px 0 rgba(37, 99, 235, 0.4)",
                "&:hover": { bgcolor: "#1d4ed8", boxShadow: "none" },
              }}
            >
              Sign In
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
