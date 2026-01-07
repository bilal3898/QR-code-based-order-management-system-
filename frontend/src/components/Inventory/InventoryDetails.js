import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Alert
} from '@mui/material';

const InventoryDetails = () => {
  const { itemId } = useParams();
  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await axios.get(`/api/inventory/${itemId}`);
        setItemDetails(response.data);
      } catch (err) {
        setError('Failed to fetch inventory details.');
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4}>
        <Alert severity="error">
          {typeof error === "string" ? error : JSON.stringify(error)}
        </Alert>
      </Box>
    );
  }

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {itemDetails.name}
        </Typography>
        <Typography variant="body1"><strong>Category:</strong> {itemDetails.category}</Typography>
        <Typography variant="body1"><strong>Quantity:</strong> {itemDetails.quantity}</Typography>
        <Typography variant="body1"><strong>Unit:</strong> {itemDetails.unit}</Typography>
        <Typography variant="body1"><strong>Price:</strong> ₹{itemDetails.price}</Typography>
        <Typography variant="body1"><strong>Supplier:</strong> {itemDetails.supplier}</Typography>
        <Typography variant="body1"><strong>Last Updated:</strong> {new Date(itemDetails.updated_at).toLocaleString()}</Typography>
      </CardContent>
    </Card>
  );
};

export default InventoryDetails;
