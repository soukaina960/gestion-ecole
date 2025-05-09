import React from "react";
import Sidebar from "./NavBar"; // Assuming you have a NavBar component
import { Outlet } from "react-router-dom";

export default function SurveillantLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}
