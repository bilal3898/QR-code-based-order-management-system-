import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";
import menuService from "../../services/menuService";

const MenuCategory = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await menuService.getAll();
        setMenuItems(response.data || []);
      } catch (err) {
        setError("Failed to fetch menu items.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Group items by category
  const itemsByCategory = menuItems.reduce((acc, item) => {
    const category = item.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">
          {typeof error === "string" ? error : JSON.stringify(error)}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Menu Categories
      </Typography>
      {Object.keys(itemsByCategory).length === 0 ? (
        <Typography>No menu items found.</Typography>
      ) : (
        Object.entries(itemsByCategory).map(([category, items]) => (
          <Card key={category} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {category}
              </Typography>
              <Box component="ul" sx={{ pl: 3, m: 0 }}>
                {items.map((item) => (
                  <Box component="li" key={item.id} sx={{ mb: 1 }}>
                    <Typography component="span" fontWeight="bold">
                      {item.name}
                    </Typography>
                    {" - "}
                    <Typography component="span" color="primary">
                      ₹{item.price}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default MenuCategory;
