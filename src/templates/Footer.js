import { Outlet } from "react-router-dom";
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
// import '../assets/container.css'
const Footer = () => {
    return (
        <>
            <footer id="footer"  className="footer py-4 px-xl-5 bg-primary" style={{marginLeft:"auto",height:"80px"}}>
                <div className="text-white mb-3 mb-md-0">
                    Copyright © 2020. All rights reserved.
                    v2.0.0
                </div>

                <div>
                    <a href="#!" className="text-white me-4">
                        <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#!" className="text-white me-4">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#!" className="text-white me-4">
                        <i className="fab fa-google"></i>
                    </a>
                    <a href="#!" className="text-white">
                        <i className="fab fa-linkedin-in"></i>
                    </a>
                </div>
            </footer>
        </>
    )
}
export default Footer;