import { Outlet } from "react-router-dom";
import logoNoBg from "../assets/logos/logo-nobg.png";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-neutral-800 text-white">
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
