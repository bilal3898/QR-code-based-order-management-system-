import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Box, CircularProgress, Button } from '@mui/material';
import menuService from '../../services/menuService';

const MenuItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const response = await menuService.getById(id);
        setItem(response.data);
      } catch (err) {
        setError('Failed to load menu item.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMenuItem();
    }
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !item) {
    return (
      <Box p={3}>
        <Typography color="error">{error || 'Menu item not found'}</Typography>
        <Button onClick={() => navigate('/menu')} sx={{ mt: 2 }}>
          Back to Menu
        </Button>
      </Box>
    );
  }

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto' }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          {item.name}
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          {item.description || 'No description available'}
        </Typography>
        <Typography variant="h5" color="primary" gutterBottom>
          ₹{item.price}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Category: {item.category}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Availability: {item.availability ? 'Available' : 'Not Available'}
        </Typography>
        <Box mt={2}>
          <Button
            variant="contained"
            onClick={() => navigate(`/menu/items/${id}/edit`)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button variant="outlined" onClick={() => navigate('/menu')}>
            Back to Menu
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MenuItem;
