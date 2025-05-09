import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";

export default function SurveillantLayout() {
  return (
    <div style={{ display: "flex" }}>
      <NavBar />
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}
