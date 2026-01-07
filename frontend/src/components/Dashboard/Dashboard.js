import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress, Box } from '@mui/material';
import {
  People,
  ShoppingCart,
  AttachMoney,
  Event,
  Restaurant,
  TableBar,
} from '@mui/icons-material';
import api from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch multiple endpoints in parallel
        const [customersRes, ordersRes, reservationsRes, tablesRes, menuRes] = await Promise.all([
          api.get('/customers').catch(() => ({ data: [] })),
          api.get('/orders').catch(() => ({ data: [] })),
          api.get('/reservations').catch(() => ({ data: [] })),
          api.get('/tables').catch(() => ({ data: [] })),
          api.get('/menu').catch(() => ({ data: [] })),
        ]);

        const customers = customersRes.data || [];
        const orders = ordersRes.data || [];
        const reservations = reservationsRes.data || [];
        const tables = tablesRes.data || [];
        const menuItems = menuRes.data || [];

        // Calculate revenue from orders
        const totalRevenue = orders.reduce((sum, order) => {
          if (order.items && Array.isArray(order.items)) {
            return sum + order.items.reduce((itemSum, item) => {
              return itemSum + (item.price || 0) * (item.quantity || 0);
            }, 0);
          }
          return sum;
        }, 0);

        // Calculate pending reservations
        const pendingReservations = reservations.filter(
          (res) => res.status === 'Reserved' || res.status === 'pending'
        ).length;

        setStats({
          total_customers: customers.length,
          total_orders: orders.length,
          total_revenue: totalRevenue.toFixed(2),
          pending_reservations: pendingReservations,
          total_tables: tables.length,
          total_menu_items: menuItems.length,
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">
          {typeof error === "string" ? error : JSON.stringify(error)}
        </Typography>
      </Box>
    );
  }

  const statCards = [
    {
      title: 'Total Customers',
      value: stats?.total_customers || 0,
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: 'Total Orders',
      value: stats?.total_orders || 0,
      icon: <ShoppingCart sx={{ fontSize: 40 }} />,
      color: '#388e3c',
    },
    {
      title: 'Revenue',
      value: `₹${stats?.total_revenue || '0.00'}`,
      icon: <AttachMoney sx={{ fontSize: 40 }} />,
      color: '#f57c00',
    },
    {
      title: 'Pending Reservations',
      value: stats?.pending_reservations || 0,
      icon: <Event sx={{ fontSize: 40 }} />,
      color: '#d32f2f',
    },
    {
      title: 'Total Tables',
      value: stats?.total_tables || 0,
      icon: <TableBar sx={{ fontSize: 40 }} />,
      color: '#7b1fa2',
    },
    {
      title: 'Menu Items',
      value: stats?.total_menu_items || 0,
      icon: <Restaurant sx={{ fontSize: 40 }} />,
      color: '#0288d1',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Dashboard Overview
      </Typography>
      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      {card.title}
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>{card.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
