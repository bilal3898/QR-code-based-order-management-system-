import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import authService from '../../services/authService';

const RoleBasedLogin = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = [
    { value: 0, label: 'Customer', role: 'customer', color: '#4CAF50' },
    { value: 1, label: 'Owner', role: 'owner', color: '#2196F3' },
    { value: 2, label: 'Staff', role: 'staff', color: '#FF9800' },
    { value: 3, label: 'Kitchen', role: 'kitchen', color: '#9C27B0' }
  ];

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (role, e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.loginRole(role, formData);
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        navigate('/dashboard');
      } else {
        setError('Login failed: No token received');
      }
    } catch (err) {
      console.error(err);
      setError(err.error || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Restaurant Management System
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            {roles.map((role) => (
              <Tab key={role.value} label={role.label} />
            ))}
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {typeof error === 'string' ? error : JSON.stringify(error)}
          </Alert>
        )}

        {roles.map((role) => (
          tabValue === role.value && (
            <Box key={role.value} sx={{ mt: 3 }}>
              <Card sx={{ mb: 3, bgcolor: `${role.color}10` }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: role.color }}>
                    {role.label} Login
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Login as {role.label.toLowerCase()} to access {role.label.toLowerCase()} features
                  </Typography>
                </CardContent>
              </Card>

              <form onSubmit={(e) => handleLogin(role.role, e)}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={loading}
                      sx={{
                        bgcolor: role.color,
                        '&:hover': { bgcolor: role.color },
                        py: 1.5
                      }}
                    >
                      {loading ? 'Logging in...' : `Login as ${role.label}`}
                    </Button>
                  </Grid>
                </Grid>
              </form>

              {role.role === 'customer' && (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button
                    variant="text"
                    onClick={() => navigate('/register')}
                    sx={{ color: role.color }}
                  >
                    Don't have an account? Register as Customer
                  </Button>
                </Box>
              )}
            </Box>
          )
        ))}

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Scan QR code to access digital menu as customer
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate('/tables/qr-scanner')}
            sx={{ mt: 2 }}
          >
            Scan QR Code
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RoleBasedLogin;
