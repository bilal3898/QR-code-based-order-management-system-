// components/Kitchen/KitchenDashboard.js

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import api from '../../services/api';
import { io } from 'socket.io-client';

const KitchenDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    const token = localStorage.getItem('token');
    const newSocket = io('http://localhost:5000', {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('[Kitchen] Connected to server');
    });

    newSocket.on('connected', (data) => {
      console.log('[Kitchen] Connection confirmed:', data);
    });

    newSocket.on('kitchen_order_update', (data) => {
      console.log('[Kitchen] Order update received:', data);
      fetchOrders(); // Refresh orders
    });

    newSocket.on('order_update', (data) => {
      console.log('[Kitchen] Order update:', data);
      fetchOrders(); // Refresh orders
    });

    newSocket.on('error', (error) => {
      console.error('[Kitchen] Socket error:', error);
    });

    setSocket(newSocket);

    // Fetch initial orders
    fetchOrders();

    return () => {
      newSocket.close();
    };
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      // Filter orders that need kitchen attention
      const kitchenOrders = response.data.filter(
        order => order.status === 'Pending' || order.status === 'Preparing'
      );
      setOrders(kitchenOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      const errorMsg = error.response?.data?.description || error.message || 'Failed to fetch orders';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus });
      fetchOrders(); // Refresh after update
    } catch (error) {
      console.error('Error updating order:', error);
      const errorMsg = error.response?.data?.description || error.message || 'Failed to update order';
      alert(errorMsg);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Preparing':
        return 'info';
      case 'Served':
        return 'success';
      case 'Completed':
        return 'default';
      default:
        return 'default';
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const preparingOrders = orders.filter(o => o.status === 'Preparing');

  if (loading) {
    return (
      <Container>
        <Typography>Loading kitchen orders...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          <RestaurantIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Kitchen Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Real-time order management for kitchen staff
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Pending Orders */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              <AccessTimeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Pending Orders ({pendingOrders.length})
            </Typography>
            <Divider sx={{ my: 2 }} />
            {pendingOrders.length === 0 ? (
              <Typography color="text.secondary">No pending orders</Typography>
            ) : (
              <List>
                {pendingOrders.map((order) => (
                  <Card key={order.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">Order #{order.id}</Typography>
                        <Chip
                          label={order.status}
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Table: {order.table_id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total: ₹{order.total_price}
                      </Typography>
                      {order.items && order.items.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2">Items:</Typography>
                          <List dense>
                            {order.items.map((item, idx) => (
                              <ListItem key={idx}>
                                <ListItemText
                                  primary={`${item.quantity}x Item #${item.menu_item_id}`}
                                  secondary={`₹${item.price} each`}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => updateOrderStatus(order.id, 'Preparing')}
                      >
                        Start Preparing
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Preparing Orders */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              <RestaurantIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Preparing Orders ({preparingOrders.length})
            </Typography>
            <Divider sx={{ my: 2 }} />
            {preparingOrders.length === 0 ? (
              <Typography color="text.secondary">No orders being prepared</Typography>
            ) : (
              <List>
                {preparingOrders.map((order) => (
                  <Card key={order.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">Order #{order.id}</Typography>
                        <Chip
                          label={order.status}
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Table: {order.table_id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total: ₹{order.total_price}
                      </Typography>
                      {order.items && order.items.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2">Items:</Typography>
                          <List dense>
                            {order.items.map((item, idx) => (
                              <ListItem key={idx}>
                                <ListItemText
                                  primary={`${item.quantity}x Item #${item.menu_item_id}`}
                                  secondary={`₹${item.price} each`}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                      <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        sx={{ mt: 2 }}
                        startIcon={<CheckCircleIcon />}
                        onClick={() => updateOrderStatus(order.id, 'Served')}
                      >
                        Mark as Ready
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default KitchenDashboard;

