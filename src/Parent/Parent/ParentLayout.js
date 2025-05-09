import NavBar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function ParentLayout() {
  return (
    <div style={{ display: "flex" }}>
      <NavBar />
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}
