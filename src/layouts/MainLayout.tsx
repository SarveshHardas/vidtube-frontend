import { Outlet } from "react-router-dom";
import logoNoBg from "../assets/logos/logo-nobg.png";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-black via-black to-[#1a0f2e] text-white">
      <header className="h-14 border-b border-gray-800 flex items-center px-2">
        <img src={logoNoBg} alt="Vidtube" className="h-24" />
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
