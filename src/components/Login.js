import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import axiosInstance from "../api/api";
import { Link, useNavigate, useLocation } from "react-router-dom";
// import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from "react-redux";
import { addNewUser } from "../store/slices/authSlice";
import { addContent } from "../store/slices/contentSlice";
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
            password: password,
        };
        console.log(userData);
        setEmail("");
        setPassword("");

        try {
            const res = await axiosInstance.post("/auth/sign-in", userData, {
                withCredentials: true,
            });
            // remove this console.log after testing

            if (res.status === 200) {
                // alert.success("Login Successful");
                newEvent("login", "logged in", "/login");
                toast.success("Successfully Login!");
                axiosInstance.defaults.headers.common["Authorization"] =
                    "Bearer " + res.data.accessToken;
                const userInfo = res.data.userInfo;
                userInfo.isLoggedIn = true;
                console.log("from data", userInfo);
                dispatch(addNewUser(userInfo));
                dispatch(addContent(res.data.content));
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
                <Toaster />
            </div>
            {/* <section className="container" style={{ height: "85vh" }} >

                <section className="section register  d-flex flex-column align-items-center justify-content-center py-4">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                                <div className="card mb-3">

                                    <div className="card-body">

                                        <div className="pt-4 pb-2">
                                            <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                                            <p className="text-center small">Enter your username & password to login</p>
                                        </div>

                                        <form className="row g-3 needs-validation" onSubmit={handleSubmit} >

                                            <div className="col-12">
                                                <label htmlFor="yourUsername" className="form-label">Username or Email</label>
                                                <div className="input-group has-validation">
                                                    <span className="input-group-text" id="inputGroupPrepend">@</span>
                                                    <input type="text" name="username" className="form-control" value={email} id="yourUsername" onChange={e => setEmail(e.target.value)} required />
                                                    <div className="invalid-feedback">Please enter your username.</div>
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <label htmlFor="yourPassword" className="form-label">Password</label>
                                                <input type="password" name="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} id="yourPassword" required />
                                                <div className="invalid-feedback">Please enter your password!</div>
                                            </div>

                                            <div className="col-12">
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" name="remember" value="true" id="rememberMe" />
                                                    <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <button className=" w-100 button-54" type="submit">Login</button>
                                            </div>
                                            <div className="col-12">
                                                <p className="small mb-0">Don't have account? <Link to="/register">Create an account</Link></p>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form
                          className="row g-3 needs-validation"
                          onSubmit={handleSubmit}
                        >
                          <div className="col-12">
                            <label htmlFor="yourUsername" className="form-label">
                              Username or Email
                            </label>
                            <div className="input-group has-validation">
                              <span
                                className="input-group-text"
                                id="inputGroupPrepend"
                              >
                                @
                              </span>
                              <input
                                type="text"
                                name="username"
                                className="form-control"
                                value={email}
                                id="yourUsername"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                              <div className="invalid-feedback">
                                Please enter your username.
                              </div>
                            </div>
                          </div>

                          <div className="col-12">
                            <label htmlFor="yourPassword" className="form-label">
                              Password
                            </label>
                            <input
                              type="password"
                              name="password"
                              className="form-control"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              id="yourPassword"
                              required
                            />
                            <div className="invalid-feedback">
                              Please enter your password!
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="remember"
                                value="true"
                                id="rememberMe"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="rememberMe"
                              >
                                Remember me
                              </label>
                            </div>
                          </div>
                          <div className="col-12">
                            <button className=" w-100 button-54" type="submit">
                              Login
                            </button>
                          </div>
                          <div className="col-12">
                            <p className="small mb-0">
                              Don't have account?{" "}
                              <Link to="/register">Create an account</Link>
                            </p>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </section> */}
            <Container
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    height: "85vh",
                    padding: isMobileView ? "20px !important" : "0px 60px !important",
                    background: "#f4f7ff",
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
                            sx={{
                                "& input": { padding: "8px 16px !important" },
                            }}
                        />
                        <TextField
                            variant="outlined"
                            placeholder="Password"
                            name="password"
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
                                background: "#3758f9",
                                "&:hover": {
                                    background: "#3758f9",
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
