import { Outlet } from "react-router-dom";
import React from 'react'
import Header from "../templates/Header";
import Footer from "../templates/Footer";

export default function Layout () {
  return (
   <main>
    <Header/>
    <Outlet/>
    <Footer/>
    </main>
  )
}

