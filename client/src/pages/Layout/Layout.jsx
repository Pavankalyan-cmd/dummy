import React, { useState } from "react";
import Sidebar from "../../component/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

import MenuOpenIcon from "@mui/icons-material/ViewSidebarOutlined";

import { IconButton, Tooltip } from "@mui/material";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 80 : 250;

  return (
    <div>
      {/* Sidebar */}
      <div
        style={{
          width: `${sidebarWidth}px`,
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          overflowY: "auto",
          backgroundColor: "#fff",
          transition: "width 0.3s ease",
          zIndex: 1000,
        }}
      >
        <Sidebar
          onToggle={() => setCollapsed(!collapsed)}
          collapsed={collapsed}
        />
      </div>

      {/* Main Content */}
      <main
        style={{
          marginLeft: `${sidebarWidth}px`,
          height: "100vh",
          overflowY: "auto",
          padding: "20px",
          transition: "margin-left 0.3s ease",
          position: "relative",
        }}
      >
        {/* Toggle button in top-left corner of main */}
        {collapsed && (
          <div style={{ position: "absolute", top: 10, left: 10 }}>
            <Tooltip title="Open Sidebar">
              <IconButton
                onClick={() => setCollapsed(false)}
                sx={{

                  borderRadius: "8px",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
              >
                <MenuOpenIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}

        <Outlet />
      </main>
    </div>
  );
}
