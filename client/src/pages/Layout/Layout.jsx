// Layout.jsx
import React from "react";
import Sidebar from "../../component/Sidebar/Sidebar";
import { Outlet } from "react-router-dom"; // import this

export default function Layout() {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          overflowY: "auto",

          padding: "20px",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
