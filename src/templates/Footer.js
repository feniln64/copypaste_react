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
            <footer id="footer"  className="footer py-4 px-xl-5 bg-primary" style={{marginLeft:"auto",bottom:0}}>
                <div className="text-white mb-3 mb-md-0">
                    Copyright © 2020. All rights reserved.
                    {version}
                </div>
                <div className="text-white mb-3 mb-md-0">
                    {description}
                </div>
                <div className="text-white mb-3 mb-md-0">
                    Server Version: {serverVersion}
                </div>
            </footer>
        </>
    )
}
export default Footer;