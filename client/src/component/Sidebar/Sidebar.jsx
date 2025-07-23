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
  Tooltip,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/PeopleAltOutlined";
import DescriptionIcon from "@mui/icons-material/DescriptionOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import MenuOpenIcon from "@mui/icons-material/ViewSidebarOutlined";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import slickbit from "../../assets/image/slickbit.png";
import TuneIcon from "@mui/icons-material/Tune";

const navItems = [
  { label: "Candidates", icon: <PeopleIcon />, path: "candidates" },
  {
    label: "Job Descriptions",
    icon: <DescriptionIcon />,
    path: "job-descriptions",
  },
];

const settingsItems = [
  { label: "Integrations", icon: <SettingsIcon />, path: "integrations" },
  { label: "Scoring Configuration", icon: <TuneIcon/>, path: "score" },
];

export default function Sidebar({ onToggle, collapsed }) {
  const navigate = useNavigate();

  const handleLogout = () => {
  
    navigate("/");
  };

  return (
    <Box
      className={`sidebar-root ${collapsed ? "collapsed" : ""}`}
      sx={{
        width: collapsed ? "70px" : "40px",
        transition: "width 0.3s ease",
        overflowX: "hidden",
      }}
    >
      {/* Header */}
      <Box
        className="sidebar-header"
        sx={{ justifyContent: collapsed ? "center" : "flex-start" }}
      >
        {!collapsed && (
          <>
            <img
              src="https://i.postimg.cc/XJG9rkr8/Adobe-Express-file.png"
              alt="RecruitPro Logo"
              className="sidebar-logo"
            />
            <Typography className="sidebar-title" variant="h6">
              RecruitPro
            </Typography>
          </>
        )}
      </Box>

      <Divider className="sidebar-divider" />

      {/* Navigation */}
      <Box className="sidebar-section">
        {!collapsed && (
          <Typography className="sidebar-section-title" variant="subtitle2">
            Navigation
          </Typography>
        )}
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
                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ className: "sidebar-list-text" }}
                  />
                )}
              </ListItemButton>
            </NavLink>
          ))}
        </List>
      </Box>

      {/* Settings */}
      <Box className="sidebar-section">
        {!collapsed && (
          <Typography className="sidebar-section-title" variant="subtitle2">
            Settings
          </Typography>
        )}
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
                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ className: "sidebar-list-text" }}
                  />
                )}
              </ListItemButton>
            </NavLink>
          ))}

          {/* Logout Button */}
          <ListItemButton className="sidebar-list-item" onClick={handleLogout}>
            <ListItemIcon className="sidebar-list-icon">
              <LogoutIcon />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{ className: "sidebar-list-text" }}
              />
            )}
          </ListItemButton>
        </List>
      </Box>

      <Divider className="sidebar-divider" />

      {/* Bottom Toggle */}
      <Box className="sidebar-bottom">
        {!collapsed && (
          <img
            src={slickbit}
            alt="Slickbit Logo"
            className="sidebar-slickbit-logo"
          />
        )}

        <Tooltip title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          <IconButton onClick={onToggle} className="sidebar-toggle-btn">
            <MenuOpenIcon
              fontSize="medium"
              style={{
                transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
