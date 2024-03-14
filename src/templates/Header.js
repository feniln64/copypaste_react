import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../store/slices/authSlice";
import { removeContent } from "../store/slices/contentSlice";
import {removeDomain} from "../store/slices/domainSlice";
import axiosInstance from "../api/api";
import React from "react";
import { Menu as MenuIcon } from "@mui/icons-material";
import { AppBar, Box, Button, IconButton, Menu, Toolbar } from "@mui/material";
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
        dispatch(removeUser());
        dispatch(removeContent());
        dispatch(removeDomain());
        navigate("/login");
    }

    return (
        <>
            <Box sx={{ flexGrow: 1, marginBottom: "100px" }}>
                <AppBar
                    position="fixed"
                    sx={{
                        background: "#fff",
                        boxShadow: "inset 0 -1px 0 0 rgba(0, 0, 0, 0.1)",
                    }}
                >
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
                            <Box
                                sx={{
                                    display: "flex",
                                    flex: 1,
                                }}
                            >
                                {!isMobileView ? (
                                    <Box sx={{ flex: 0.7 }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                color: "black",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Button>
                                                <Link
                                                    className="nav-link mx-2  "
                                                    to="/shared"
                                                >
                                                    Shared
                                                </Link>
                                            </Button>
                                            <Button>
                                                <Link
                                                    className="nav-link mx-2  "
                                                    to="/content"
                                                >
                                                    Content
                                                </Link>
                                            </Button>
                                            <Button>
                                                <Link
                                                    className="nav-link mx-2  "
                                                    to="/add-domain"
                                                >
                                                    Add Domain
                                                </Link>
                                            </Button>
                                        </Box>
                                        {/* <Avatar 
                                            src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                                            sx={{width: "30px", height: "30px"}}
                                        /> */}
                                    </Box>
                                ) : (
                                    <Box
                                        sx={{
                                            flex: 0.9,
                                            justifyContent: "flex-end",
                                            display: "flex",
                                        }}
                                    >
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
                                                    <Link to="/content">
                                                        Content
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="inherit"
                                                >
                                                    <Link to="/add-domain">
                                                        Add Domain
                                                    </Link>
                                                </Button>
                                            </Box>
                                        </Menu>
                                    </Box>
                                )}
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: !isMobileView
                                            ? "flex-end"
                                            : "center",
                                        alignItems: "center",
                                        flex: !isMobileView ? 0.3 : 0.1,
                                    }}
                                >
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
                            </Box>
                        )}
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    );
};

export default Header;
