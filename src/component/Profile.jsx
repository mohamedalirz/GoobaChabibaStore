import React, { useState } from "react";
import "./Profile.css";
const Profile = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+216 00 000 000",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert("Profile Updated ✅\n" + 
          `Name: ${user.name}\nEmail: ${user.email}\nPhone: ${user.phone}`);
  };

  return (
    <div className="profile-container">
    <div style={{ maxWidth: "400px", margin: "50px auto", fontFamily: "sans-serif" }}>
      <h2>My Profile</h2>
      
      <div style={{ marginBottom: "10px" }}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Phone:</label>
        <input
          type="text"
          name="phone"
          value={user.phone}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      <button onClick={handleSave} style={{ padding: "10px 20px" }}>
        Save
      </button>
    </div>
    </div>
  );
};

export default Profile;