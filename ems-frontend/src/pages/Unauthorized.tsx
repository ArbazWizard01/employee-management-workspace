import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: 4,
        }}
      >
        <Typography variant="h3" color="error" gutterBottom sx={{ fontWeight: 'bold' }}>
          403 - Unauthorized
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ mb: 3 }}>
          You do not have permission to access this area.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Go to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default Unauthorized;