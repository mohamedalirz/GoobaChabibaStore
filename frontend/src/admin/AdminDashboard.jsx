import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import DashboardHome from "./DashboardHome";
import "./Admin.css";

function AdminDashboard() {
  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-main">
        <AdminNavbar />
        <DashboardHome />
      </div>
    </div>
  );
}

export default AdminDashboard;
