import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import AdminRegister from "./pages/AdminRegister";
import BusResults from "./pages/BusResults";
import SeatSelection from "./pages/SeatSelection";

import Account from "./pages/Account";

import Navbar from "./components/Navbar"; // ✅ import Navbar

const App = () => {
  return (
    <div>
     
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/results" element={<BusResults />} />
        <Route path="/seat-selection/:busId" element={<SeatSelection />} />
        <Route path="/account/login" element={<Account />} />
        <Route path="/account/signup" element={<Account />} />


      </Routes>
    </div>
  );
};

export default App;



