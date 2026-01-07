import React from "react";
import { List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { Dashboard, Restaurant, TableBar, Feedback, ShoppingCart, People } from "@mui/icons-material";
import { Link } from "react-router-dom";

const DashboardList = () => {
  const menuItems = [
    { text: "Overview", icon: <Dashboard />, path: "/dashboard" },
    { text: "Orders", icon: <ShoppingCart />, path: "/orders" },
    { text: "Tables", icon: <TableBar />, path: "/tables" },
    { text: "Menu", icon: <Restaurant />, path: "/menu" },
    { text: "Customers", icon: <People />, path: "/customers" },
    { text: "Feedback", icon: <Feedback />, path: "/feedback" },
  ];

  return (
    <List>
      {menuItems.map((item, index) => (
        <Link to={item.path} key={index} style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItem button>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        </Link>
      ))}
      <Divider />
    </List>
  );
};

export default DashboardList;
