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

const RoleBasedRegister = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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

  const handleRegister = async (role, e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await authService.registerRole(role, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      });

      setSuccess(`${role.label} registration successful! Redirecting to login...`);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.error || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
    setSuccess('');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Register - Restaurant Management System
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

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {roles.map((role) => (
          tabValue === role.value && (
            <Box key={role.value} sx={{ mt: 3 }}>
              <Card sx={{ mb: 3, bgcolor: `${role.color}10` }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: role.color }}>
                    Register as {role.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Create a {role.label.toLowerCase()} account to access {role.label.toLowerCase()} features
                  </Typography>
                </CardContent>
              </Card>

              <form onSubmit={(e) => handleRegister(role.role, e)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
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
                  <Grid item xs={12} sm={6}>
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
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
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
                      {loading ? 'Registering...' : `Register as ${role.label}`}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          )
        ))}

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="text"
            onClick={() => navigate('/login')}
            sx={{ color: '#2196F3' }}
          >
            Already have an account? Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RoleBasedRegister;
