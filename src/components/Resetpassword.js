import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/api";
import toast, { Toaster } from "react-hot-toast";

import { Box, Button, Container, TextField, Typography } from "@mui/material";
import useScreenSize from "../hooks/useScreenSize";

const Resetpassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    let { token } = useParams();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== newPassword) {
            toast.error("Password does not match", { icon: "👎" });
            return;
        }
        const userData = {
            password: newPassword,
        };
        console.log(userData);
        setPassword("");

        try {
            const res = await axiosInstance.post(`/auth/reset-password/${token}`, userData);
            if (res.status === 200) {
                toast.success(res.data.message, { icon: "👍" });
                navigate("/login");
            }
        } catch (error) {
            toast.error(error.response.data.message, { icon: "👎" });
        }
    };

    const [isMobileView] = useScreenSize();

    return (
        <>
            <Toaster position='bottom-right' reverseOrder={false} />

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
                        Reset Password
                    </Typography>
                    <Typography textAlign={"center"} sx={{ fontSize: "14px" }}>
                        Enter your New Password
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
                            placeholder="New Password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            fullWidth
                            value={password}
                            type="password"
                            sx={{
                                "& input": { padding: "8px 16px !important" },
                            }}
                        />
                        <TextField
                            variant="outlined"
                            placeholder="Retype Password"
                            name="resetpassword"
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            fullWidth
                            type="password"
                            value={newPassword}
                            sx={{
                                "& input": { padding: "8px 16px !important" },
                            }}
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
                            Send Email
                        </Button>
                    </form>
                </Box>
            </Container>
        </>
    );
}

export default Resetpassword;