import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";

import RegistrationForm from "./components/new/registrationForm";
import LoginForm from "./components/new/logInForm";

import User from "./components/new/User";

const RouteSwitch = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        <Route path="/registration" element={ <RegistrationForm /> } />
        <Route path="/login" element={ <LoginForm /> } />
        <Route path="/user/:login" element={ <User /> } />
        
      </Routes>
    </BrowserRouter>
  );
};

export default RouteSwitch;