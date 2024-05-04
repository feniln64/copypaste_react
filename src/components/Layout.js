import { Outlet } from "react-router-dom";
import React from 'react'
import Header from "../templates/Header";
import Footer from "../templates/Footer";
import { Box } from "@mui/material";
import Logout from "../common/Logout";

export default function Layout () {
  return (
    <main>
      <Header/>
      <Box sx={{minHeight: { xs: 'calc(100vh - 200px)' ,md: "calc(100vh - 212px)"}}}>
        <Outlet/>
      </Box>
      <Footer/>
    </main>
  )
}

