import React from "react";

function AdminSidebar() {
  return (
    <div className="admin-sidebar">
      <h2 className="logo">GOOBA</h2>

      <ul>
        <li className="active">Dashboard</li>
        <li>Products</li>
        <li>Orders</li>
        <li>Users</li>
      </ul>
    </div>
  );
}

export default AdminSidebar;
