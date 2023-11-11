import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { removeUser } from '../store/slices/authSlice'
import axiosInstance from '../api/api'
import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import "../assets/button.css"
import "../assets/navbar.css"
import "../assets/bizland.css"



const Header = () => {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
    const userInfo = useSelector((state) => state.auth.userInfo)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    function logout() {
        axiosInstance.post("/auth/logout", {}, { withCredentials: true })
            .then((response) => {
                console.log("profile.response =", response);
            })
            .catch((error) => {
                console.log(error);
            });
        localStorage.removeItem("jwt");
        localStorage.removeItem("userInfo");
        navigate("/login");
        dispatch(removeUser())
    }

    return (
        <>
            <header id="header" className="d-flex align-items-center">

                <div className="container d-flex align-items-center justify-content-between">
                    <Link to="/" className="logo"><img src="assets/img/old.png" alt="" /></Link>
                    <nav id="navbar" className="navbar">
                        <ul>
                            {!isLoggedIn && (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link active" to="/login">Login</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link " to="/register">Sign Up</Link>
                                    </li>
                                </>)}

                            {isLoggedIn && (<>
                                <li><Link className="nav-link mx-2  " to="/content">Content</Link></li>
                                <li><Link className="nav-link mx-2  " to="/add-domain">Add Domain</Link></li>
                                <li className="dropdown"> <span><img
                                    style={{ width: 30, height: 30 }}
                                    src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                                    className="rounded-circle"
                                    alt="Black and White Portrait of a Man"
                                /></span> <i className="bi bi-chevron-down"></i>
                                    <ul style={{ width: "150px" }}>
                                        <li><Link to="/profile">Profile</Link></li>
                                        <li><a className="" onClick={logout}>Log Out</a></li>
                                        <li><a href="#">Contact us</a></li>
                                    </ul>
                                </li>
                            </>
                            )}
                        </ul>
                        <i className="bi bi-list mobile-nav-toggle"></i>
                    </nav>

                </div>
            </header>

            {/* <nav className="navbar navbar-expand-lg  text-dark p-2" >
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/"><img src="assets/img/old.png" style={{ height: "50px" }}></img></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className=" collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className=" nav navbar-nav ms-auto ">
                            {!isLoggedIn && (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link mx-2 active button-54" aria-current="page" to="/login">Login</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link mx-2 active button-54" to="/register">Sign Up</Link>
                                    </li>
                                </>)}

                            {isLoggedIn && (<>
                                <li className="nav-item">
                                    <Link className="nav-link mx-2 active " to="/content">Content</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link mx-2 active " to="/add-domain">Add Domain</Link>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link mx-2 dropdown-toggle" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img
                                            style={{ width: 30, height: 30 }}
                                            src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                                            className="rounded-circle"
                                            alt="Black and White Portrait of a Man"
                                        />
                                    </a>

                                    <ul className="dropdown-menu mx-2"  >
                                        <li><Link className="dropdown-item mx-2" to="/profile">Profile</Link></li>
                                        <li><a className="dropdown-item" onClick={logout}>Log Out</a></li>
                                        <li><a className="dropdown-item" href="#">Contact us</a></li>
                                    </ul>
                                </li>
                            </>)}

                        </ul>
                    </div>
                </div>
            </nav> */}
        </>
    )
}

export default Header
