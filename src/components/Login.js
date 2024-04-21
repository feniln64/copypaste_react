import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import axiosInstance from "../api/api";
import { Link, useNavigate, useLocation } from "react-router-dom";
// import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from "react-redux";
import { addNewUser } from "../store/slices/authSlice";
import { addContent } from "../store/slices/contentSlice";
import { initDomain } from "../store/slices/domainSlice";
import { initSharedBy } from "../store/slices/sharedBySlice";
import {initSharedWithMe} from '../store/slices/sharedWithMeSlice'
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/button.css";
import "../assets/container.css";
import newEvent from "../api/postHog";
import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import useScreenSize from "../hooks/useScreenSize";

export default function Login() {
    const location = useLocation();
    const message = location.state?.message;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [checked, setIsChecked] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {
            email: email,
            password: password
        };
        console.log(userData);
        setEmail("");
        setPassword("");

        try {
            const res = await axiosInstance.post("/auth/sign-in", userData, {
                withCredentials: true,
            });
            if (res.status === 200) {
                // alert.success("Login Successful");
                newEvent("login", "logged in", "/login");
                toast.success("Successfully Login!");
                axiosInstance.defaults.headers.common["Authorization"] ="Bearer " + res.data.accessToken;
                const userInfo = res.data.userInfo;
                userInfo.isLoggedIn = true;
                console.log(res.data);
                dispatch(addNewUser(userInfo));
                dispatch(addContent(res.data.content));
                dispatch(initDomain(res.data.subdomains));
                dispatch(initSharedBy(res.data.sharedByMe));
                dispatch(initSharedWithMe(res.data.shraedWithMe));
                navigate("/");
            }
        } catch (error) {
            toast.error(error.response.data.message, { icon: "👎" });
        }
    };

    useEffect(() => {
        if (message) {
            toast.success(message);
        }
    }, [message]);

    const [isMobileView] = useScreenSize();

    return (
        <>
            <div>
                <Toaster position='bottom-right' reverseOrder={false}/>
            </div>
            <Container
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    height: "85vh",
                    padding: isMobileView ? "20px !important" : "0px 60px !important",
                    background: "#f8f9fA",
                }}
                maxWidth="sm"
            >
                <Box
                    sx={{
                        borderRadius: "0.5rem",
                        width: "inherit",
                        padding: isMobileView ? "30px" : "60px",
                        background: "#fff",
                        display: "flex",
                        gap: "12px",
                        flexDirection: "column",
                    }}
                >
                    <Typography
                        textAlign={"center"}
                        sx={{
                            fontSize: "28px",
                            fontWeight: 600,
                            color: "#012970",
                        }}
                    >
                        Login to your Account
                    </Typography>
                    <Typography textAlign={"center"} sx={{ fontSize: "14px" }}>
                        Enter your username & password to login
                    </Typography>
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            gap: "20px",
                        }}
                    >
                        <TextField
                            variant="outlined"
                            placeholder="Email"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            fullWidth
                            value={email}
                            sx={{
                                "& input": { padding: "8px 16px !important" },
                            }}
                        />
                        <TextField
                            variant="outlined"
                            placeholder="Password"
                            name="password"
                            value={password}
                            type={showPassword ? "text" : "password"}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {" "}
                                        {showPassword ? (
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    setShowPassword(false)
                                                }
                                            >
                                                <Visibility
                                                    sx={{
                                                        color: "#9E9E9E",
                                                        cursor: "pointer",
                                                        width: "14px",
                                                        height: "14px",
                                                    }}
                                                    fontSize="small"
                                                />
                                            </IconButton>
                                        ) : (
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    setShowPassword(true)
                                                }
                                            >
                                                <VisibilityOff
                                                    sx={{
                                                        color: "#9E9E9E",
                                                        cursor: "pointer",
                                                        width: "14px",
                                                        height: "14px",
                                                    }}
                                                    fontSize="small"
                                                />
                                            </IconButton>
                                        )}
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                "& input": { padding: "8px 16px !important" },
                            }}
                        />
                        <FormControlLabel
                            label="Remember Me"
                            control={
                                <Checkbox
                                    checked={checked}
                                    onChange={(e) =>
                                        setIsChecked(e.target.checked)
                                    }
                                />
                            }
                        />
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{
                                borderRadius: "8px",
                                background: "#0d6efd",
                                "&:hover": {
                                    background: "#0d6efd",
                                },
                            }}
                        >
                            Login
                        </Button>
                    </form>
                    <Box>
                        Don't have account?{" "}
                        <Link to="/register">Create an account</Link>
                    </Box>
                </Box>
            </Container>
        </>
    );
}
