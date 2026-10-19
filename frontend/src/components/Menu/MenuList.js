import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Restaurant as RestaurantIcon } from '@mui/icons-material';
import menuService from "../../services/menuService";

const MenuList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await menuService.getAll();
        setMenuItems(response.data || []);
      } catch (err) {
        setError("Failed to fetch menu items.");
        console.error("Menu fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
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
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <RestaurantIcon sx={{ fontSize: 32, color: '#1976d2' }} />
            <Typography variant="h4" component="h1">
              Menu Items
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            to="/menu/items/new"
            sx={{
              bgcolor: '#1976d2',
              '&:hover': { bgcolor: '#1565c0' }
            }}
          >
            Add New Item
          </Button>
        </Box>

        {menuItems.length === 0 ? (
          <Box textAlign="center" py={8}>
            <RestaurantIcon sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              No menu items found
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Add your first menu item to get started
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menuItems.map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {item.name}
                      </Typography>
                      {item.description && (
                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>
                          {item.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.category}
                        size="small"
                        sx={{
                          bgcolor: '#e3f2fd',
                          color: '#1976d2',
                          fontWeight: 'medium'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="bold" color="#2e7d32">
                        ₹{item.price}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.is_available ? 'Available' : 'Unavailable'}
                        size="small"
                        color={item.is_available ? 'success' : 'error'}
                        sx={{ fontWeight: 'medium' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        component={Link}
                        to={`/menu/items/${item.id}/edit`}
                        sx={{
                          borderColor: '#1976d2',
                          color: '#1976d2',
                          '&:hover': {
                            borderColor: '#1565c0',
                            bgcolor: '#e3f2fd'
                          }
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default MenuList;
