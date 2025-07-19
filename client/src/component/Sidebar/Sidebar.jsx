import React from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/PeopleAltOutlined";
import UploadIcon from "@mui/icons-material/UploadOutlined";
import DescriptionIcon from "@mui/icons-material/DescriptionOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorderOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import MenuOpenIcon from "@mui/icons-material/ViewSidebarOutlined";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const navItems = [

  { label: "Candidates", icon: <PeopleIcon />, path: "candidates" },
  {
    label: "Job Descriptions",
    icon: <DescriptionIcon />,
    path: "job-descriptions",
  },
];

const settingsItems = [
  { label: "Integrations", icon: <SettingsIcon />, path: "settings" },
];

export default function Sidebar({ onToggle }) {
  return (
    <Box className="sidebar-root">
      {/* Header */}
      <Box className="sidebar-header">
        <img src="/logo.svg" alt="RecruitPro Logo" className="sidebar-logo" />
        <Typography className="sidebar-title" variant="h6">
          RecruitPro
        </Typography>
      </Box>

      <Divider className="sidebar-divider" />

      {/* Navigation Section */}
      <Box className="sidebar-section">
        <Typography className="sidebar-section-title" variant="subtitle2">
          Navigation
        </Typography>
        <List>
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={`/dashboard/${item.path}`}
              className={({ isActive }) =>
                `sidebar-list-link ${isActive ? "active" : ""}`
              }
              style={{ textDecoration: "none" }}
            >
              <ListItemButton className="sidebar-list-item">
                <ListItemIcon className="sidebar-list-icon">
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ className: "sidebar-list-text" }}
                />
              </ListItemButton>
            </NavLink>
          ))}
        </List>
      </Box>

      {/* Settings Section */}
      <Box className="sidebar-section">
        <Typography className="sidebar-section-title" variant="subtitle2">
          Settings
        </Typography>
        <List>
          {settingsItems.map((item) => (
            <NavLink
              key={item.label}
              to={`/dashboard/${item.path}`}
              className={({ isActive }) =>
                `sidebar-list-link ${isActive ? "active" : ""}`
              }
              style={{ textDecoration: "none" }}
            >
              <ListItemButton className="sidebar-list-item">
                <ListItemIcon className="sidebar-list-icon">
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ className: "sidebar-list-text" }}
                />
              </ListItemButton>
            </NavLink>
          ))}
        </List>
      </Box>

      <Divider className="sidebar-divider" />

      {/* Bottom Toggle */}
      <Box className="sidebar-bottom">
        <IconButton onClick={onToggle} className="sidebar-toggle-btn">
          <MenuOpenIcon fontSize="medium" />
        </IconButton>
      </Box>
    </Box>
  );
}
