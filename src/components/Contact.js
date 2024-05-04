import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../api/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/button.css";
import "../assets/container.css";
import {Box,Button,Container,TextField,Typography,} from "@mui/material";
import useScreenSize from "../hooks/useScreenSize";

export default function Contact() {
    
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {
            email: email,
            name: name,
            message: message
        };
        console.log(userData);
        setName("");
        setEmail("");
        setMessage("");

        try {
            const res = await axiosInstance.post("/user/contact-us", userData);
            if (res.status === 200) {
                toast.success(res.data.message, { icon: "👍" });
            }
        } catch (error) {
            toast.error(error.response.data.message, { icon: "👎" });
        }
    };

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
                        Contact Us
                    </Typography>
                    <Typography textAlign={"center"} sx={{ fontSize: "14px" }}>
                        Enter your Name Email and Message
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
                            placeholder="Name"
                            name="name"
                            onChange={(e) => setName(e.target.value)}
                            required
                            fullWidth
                            value={name}
                            sx={{
                                "& input": { padding: "8px 16px !important" },
                            }}
                        />
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
                            placeholder="Message"
                            name="message"
                            type="textarea"
                            multiline
                            minRows={4}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            fullWidth
                            value={message}
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
                            Submit
                        </Button>
                    </form>
                </Box>
            </Container>
        </>
    );
}
