import logo from './logo.svg';
import './App.css';
import { Route, Routes } from "react-router-dom";
import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import { useEffect, useState } from 'react';
import Profile from './components/Profile';
import Error from './templates/Error';
function App() {
  return (
    <Routes>
        <Route path="/" element={<Layout />} >

        <Route index element={<Home/>} />
        <Route path={"/login"} element={<Login/>} />
        <Route path={"/register"} element={<Register/>} />
        <Route path={"/profile"} element={<Profile/>} />

        <Route path={"*"} element={<Error/>} />

        </Route>
      </Routes>
  );
}

export default App;
