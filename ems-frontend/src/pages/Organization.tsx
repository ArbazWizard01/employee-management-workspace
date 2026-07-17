import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Paper } from '@mui/material';
import { Tree } from 'antd';
import { useCustomTheme } from '../context/CustomThemeContext';
import api from '../services/api';

export const Organization: React.FC = () => {
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { mode } = useCustomTheme();

  useEffect(() => {
    api.get('/employees/organization/tree')
      .then(res => {
        setTreeData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load organizational structure charts.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>Organizational Structure</Typography>
        <Typography variant="body2" color="text.secondary">Hierarchical chart display showing live active operational report chains.</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper 
        sx={{ 
          p: 4, 
          bgcolor: 'background.paper', 
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          boxShadow: 'none',
          '& .ant-tree': {
            bgcolor: 'transparent',
            color: mode === 'dark' ? '#ffffff !important' : '#0f172a !important',
          },
          '& .ant-tree-node-content-wrapper': {
            color: mode === 'dark' ? '#ffffff !important' : '#0f172a !important',
          },
          '& .ant-tree-node-content-wrapper:hover': {
            bgcolor: mode === 'dark' ? '#1e293b !important' : '#f1f5f9 !important',
            color: mode === 'dark' ? '#ffffff !important' : '#0f172a !important',
          },
          '& .ant-tree-node-selected': {
            bgcolor: '#2563eb !important',
            color: '#ffffff !important',
          },
          '& .ant-tree-node-selected .ant-tree-title': {
            color: '#ffffff !important',
          },
          '& .ant-tree-indent-unit': {
            borderColor: 'divider',
          },
          '& .ant-tree-switcher': {
            color: mode === 'dark' ? '#94a3b8 !important' : '#475569 !important',
            bgcolor: 'transparent !important',
          }
        }}
      >
        {treeData.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No structural links built yet.</Typography>
        ) : (
          <Tree
            showLine={{ showLeafIcon: false }}
            defaultExpandAll
            treeData={treeData}
          />
        )}
      </Paper>
    </Box>
  );
};

export default Organization;