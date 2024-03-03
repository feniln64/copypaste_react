import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../store/slices/authSlice";
import axiosInstance from "../api/api";
// import 'bootstrap/dist/css/bootstrap.min.css'
import React from "react";
// import "../assets/button.css"
// import "../assets/navbar.css"
// import "../assets/bizland.css"
// import Button from 'react-bootstrap/Button';
// import Container from "react-bootstrap/Container";
// import Form from 'react-bootstrap/Form';
// import Nav from "react-bootstrap/Nav";
// import Navbar from "react-bootstrap/Navbar";
// import NavDropdown from "react-bootstrap/NavDropdown";
import { Menu as MenuIcon, AccountCircle } from "@mui/icons-material";
import {
    AppBar,
    Avatar,
    Box,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from "@mui/material";
import useScreenSize from "../hooks/useScreenSize";
import { NavDropdown } from "react-bootstrap";

const Header = () => {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const userInfo = useSelector((state) => state.auth.userInfo);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isMobileView] = useScreenSize();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    function logout() {
        axiosInstance
            .post("/auth/logout", {}, { withCredentials: true })
            .then((response) => {
                console.log("profile.response =", response);
            })
            .catch((error) => {
                console.log(error);
            });
        localStorage.removeItem("jwt");
        localStorage.removeItem("userInfo");
        navigate("/login");
        dispatch(removeUser());
    }

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="fixed" sx={{ background: "#f6f9ff" }}>
                    <Toolbar>
                        <Link to="/" className="logo">
                            <img src="assets/img/old.png" alt="" />
                        </Link>
                        {!isLoggedIn && (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    flex: 1,
                                    gap: "12px",
                                }}
                            >
                                {!isMobileView ? (
                                    <>
                                        <Button
                                            component={Link}
                                            to="/login"
                                            variant="contained"
                                            sx={{
                                                backgroundColor: "#3758f9",
                                                "&:hover": {
                                                    backgroundColor: "#3758f9",
                                                    color: "#fff",
                                                },
                                            }}
                                        >
                                            Login
                                        </Button>
                                        <Button
                                            component={Link}
                                            to="/register"
                                            variant="contained"
                                            sx={{
                                                backgroundColor: "#3758f9",
                                                "&:hover": {
                                                    backgroundColor: "#3758f9",
                                                    color: "#fff",
                                                },
                                            }}
                                        >
                                            Sign Up
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <IconButton
                                            size="large"
                                            edge="start"
                                            color="inherit"
                                            aria-label="menu"
                                            onClick={handleMenu}
                                        >
                                            <MenuIcon
                                                sx={{ fill: "#3758f9" }}
                                            />
                                        </IconButton>
                                        <Menu
                                            id="menu-appbar"
                                            anchorEl={anchorEl}
                                            anchorOrigin={{
                                                vertical: "bottom",
                                                horizontal: "left",
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: "top",
                                                horizontal: "center",
                                            }}
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    padding: "12px",
                                                    gap: "12px",
                                                }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    color="inherit"
                                                >
                                                    <Link to="/login">
                                                        Login
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="inherit"
                                                >
                                                    <Link to="/register">
                                                        Sign Up
                                                    </Link>
                                                </Button>
                                            </Box>
                                        </Menu>
                                    </>
                                )}
                            </Box>
                        )}
                        {isLoggedIn && (
                            <Box>
                                {!isMobileView ? (
                                    <Box>
                                        <Box>
                                            <Link
                                                className="nav-link mx-2  "
                                                to="/content"
                                            >
                                                Content
                                            </Link>

                                            <Link
                                                className="nav-link mx-2  "
                                                to="/add-domain"
                                            >
                                                Add Domain
                                            </Link>
                                        </Box>
                                        {/* <Avatar 
                                            src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                                            sx={{width: "30px", height: "30px"}}
                                        /> */}
                                    </Box>
                                ) : (
                                    <>
                                        <IconButton
                                            size="large"
                                            edge="start"
                                            color="inherit"
                                            aria-label="menu"
                                            onClick={handleMenu}
                                        >
                                            <MenuIcon
                                                sx={{ fill: "#3758f9" }}
                                            />
                                        </IconButton>
                                        <Menu
                                            id="menu-appbar"
                                            anchorEl={anchorEl}
                                            anchorOrigin={{
                                                vertical: "bottom",
                                                horizontal: "left",
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: "top",
                                                horizontal: "center",
                                            }}
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    padding: "12px",
                                                    gap: "12px",
                                                }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    color="inherit"
                                                >
                                                    <Link to="/login">
                                                        Login
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="inherit"
                                                >
                                                    <Link to="/register">
                                                        Sign Up
                                                    </Link>
                                                </Button>
                                            </Box>
                                        </Menu>
                                    </>
                                )}
                                <NavDropdown
                                    title={
                                        <span>
                                            <img
                                                style={{
                                                    width: 30,
                                                    height: 30,
                                                }}
                                                src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                                                className="rounded-circle"
                                                alt="Black and White Portrait of a Man"
                                            />
                                        </span>
                                    }
                                    drop="start"
                                >
                                    <NavDropdown.Item>
                                        <Link to="/profile">Profile</Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={logout}>
                                        Log Out
                                    </NavDropdown.Item>
                                    <NavDropdown.Item>
                                        Contact us
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Box>
                        )}
                    </Toolbar>
                </AppBar>
            </Box>
            {/* <Navbar expand="lg" className="bg-body-tertiary">
                <Container fluid>
                    <Navbar.Brand>
                        <Link to="/" className="logo">
                            <img src="assets/img/old.png" alt="" />
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: "150px" }}
                            navbarScroll
                        ></Nav>
                        {!isLoggedIn && (
                            <>
                                <Nav className="d-flex">
                                    <Link
                                        className="nav-link active"
                                        to="/login"
                                    >
                                        Login
                                    </Link>
                                    <Link className="nav-link " to="/register">
                                        Sign Up
                                    </Link>
                                </Nav>
                            </>
                        )}
                        {isLoggedIn && (
                            <>
                                <Nav className="d-flex">
                                    <Link
                                        className="nav-link mx-2  "
                                        to="/content"
                                    >
                                        Content
                                    </Link>

                                    <Link
                                        className="nav-link mx-2  "
                                        to="/add-domain"
                                    >
                                        Add Domain
                                    </Link>

                                    <NavDropdown
                                        title={
                                            <span>
                                                <img
                                                    style={{
                                                        width: 30,
                                                        height: 30,
                                                    }}
                                                    src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                                                    className="rounded-circle"
                                                    alt="Black and White Portrait of a Man"
                                                />
                                            </span>
                                        }
                                        drop="start"
                                    >
                                        <NavDropdown.Item>
                                            <Link to="/profile">Profile</Link>
                                        </NavDropdown.Item>
                                        <NavDropdown.Item onClick={logout}>
                                            Log Out
                                        </NavDropdown.Item>
                                        <NavDropdown.Item>
                                            Contact us
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                </Nav>
                            </>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar> */}
            {/* <header id="header" className="d-flex align-items-center">

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
            </header> */}
        </>
    );
};

export default Header;
