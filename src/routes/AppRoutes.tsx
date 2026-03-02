import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "../pages/Homepage";
import MainLayout from "../layouts/MainLayout";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Homepage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
