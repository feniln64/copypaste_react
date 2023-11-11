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
import Domain from './components/Domain';
import ViewContent from './components/ViewContent';
import Content from './components/Content';
import Test from './components/Test';
import ReactGA from 'react-ga';
ReactGA.initialize('G-7PR5M4K0RF');
ReactGA.initialize('UA-000000-01');
ReactGA.pageview(window.location.pathname + window.location.search);
function App() {
  return (
    <Routes>
        <Route path="/" element={<Layout />} >

        <Route index element={<Home/>} />
        <Route path={"/login"} element={<Login/>} />
        <Route path={"/register"} element={<Register/>} />
        <Route path={"/profile"} element={<Profile/>} />
        <Route path={"/add-domain"} element={<Domain/>} />
        <Route path={"/content"} element={<ViewContent/>} />
        <Route path={"/create-content"} element={<Content/>} />
        <Route path={"/test"} element={<Test/>} />
        <Route path={"*"} element={<Error/>} />

        </Route>
      </Routes>
  );
}

export default App;
