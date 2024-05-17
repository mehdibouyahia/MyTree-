import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Admin from "./components/Admin";
import FamilyTree from './components/FamilyTree';


function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/family-tree/:userId" element={<FamilyTree />} />

            <Route path="/resetPassword/:token" element={<ResetPassword />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/" element={<Login />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
