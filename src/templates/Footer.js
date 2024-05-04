import { Outlet } from "react-router-dom";
import React, { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import axiosInstance from '../api/api'
import json from '../../package.json'
//https://node.cpypst.online/init/version
// import '../assets/container.css'
const Footer = () => {
    const version = json.version;
    const description = json.description;
    const [serverVersion, setServerVersion] = React.useState("");
    useEffect(() => {
        axiosInstance.get("/init/version")
            .then((response) => {
                setServerVersion(response.data.version);                
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])
    return (
        <>
            <footer id="footer"  className="footer ml-3 py-4 px-xl-5 bg-primary" style={{marginLeft:"auto",bottom:0,backgroundColor:'#A3D1DE'}}>
                <div className="text-white mb-3 mb-md-0" style={{marginLeft:'20px'}}>
                    Copyright © 2020. All rights reserved.
                   
                </div>
                <div className="text-white mb-3 mb-md-0" style={{marginLeft:'20px'}}>
                Version: {version}
                </div>
                <div className="text-white mb-3 mb-md-0" style={{marginLeft:'20px'}}>
                    Server Version: {serverVersion}
                </div>
            </footer>
        </>
    )
}
export default Footer;