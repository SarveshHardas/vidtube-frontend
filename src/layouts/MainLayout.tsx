import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-black via-black to-[#1a0f2e] text-white">
      <Navbar/>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
