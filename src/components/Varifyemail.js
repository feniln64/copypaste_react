import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/api";
import toast, { Toaster } from "react-hot-toast";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import useScreenSize from "../hooks/useScreenSize";

const Varifyemail = () => {
    const navigate = useNavigate();
    let { token } = useParams();
    const [isvarified, setIsVarified] = useState(false);
    const [isMobileView] = useScreenSize();
    const [email, setEmail] = useState("");
    const varifyEmail = async () => {
        try {
            const res = await axiosInstance.get(`/auth/varify/email/${token}`);
            if (res.status === 200) {
                setIsVarified(true);
                toast.success(res.data.message, { icon: "👍" });
            }
        } catch (error) {
            toast.error(error.response.data.message, { icon: "👎" });
        }
    };

    const handleResendEmail = async () => {

        try {
            const res = await axiosInstance.post("/auth/resend/email", {email: email})
            .then((response) => {
                if (response.status === 200) {
                    toast.success(response.data.message, { icon: "👍" });
                }
            })
            
            
        } catch (error) {
            toast.error(error.response.data.message, { icon: "👎" }
            );
        }
        setEmail("");
    };


    useEffect(() => {
        varifyEmail();
    }, [token, navigate]);

    return (
        <>
            <Toaster position='bottom-right' reverseOrder={false} />
            {isvarified && (
                <>
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
                                Email Varified
                            </Typography>
                            <form

                                style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                    gap: "20px",
                                }}
                            >
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
                                    onClick={navigate("/login")}
                                >
                                    Go to Login
                                </Button>
                            </form>
                        </Box>
                    </Container>
                </>
            )}
            {!isvarified && (
                <>
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
                                Email Not Varified
                            </Typography>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleResendEmail();
                                }}
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                    gap: "20px",
                                }}
                            >
                                <TextField  
                                    label="Email"
                                    variant="outlined"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    Resed Email
                                </Button>
                            </form>
                        </Box>
                    </Container>
                </>
            )}

        </>
    );
}

export default Varifyemail;