import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { removeUser } from '../store/slices/authSlice'
import axiosInstance from '../api/api'
import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import "../assets/button.css"
import "../assets/navbar.css"


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

            <nav className="navbar navbar-expand-lg  text-dark p-2" >
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/"><img src="assets/img/old.png" style={{height: "50px"}}></img></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className=" collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav ms-auto ">
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
                                    <Link className="nav-link mx-2 active" to="/content">Content</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link mx-2 active" to="/add-domain">Add Domain</Link>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link mx-2 dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img
                                            style={{ width: 30, height: 30 }}
                                            src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                                            className="rounded-circle"
                                            alt="Black and White Portrait of a Man"
                                            loading="lazy"
                                        />
                                    </a>

                                    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start" aria-labelledby="navbarDropdownMenuLink" >
                                        <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                                        <li><a className="dropdown-item" onClick={logout}>Log Out</a></li>
                                        <li><a className="dropdown-item" href="#">Contact us</a></li>
                                    </ul>
                                </li>
                            </>)}

                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header
