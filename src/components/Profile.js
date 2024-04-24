import React, { useEffect, useState } from 'react'
import '../assets/profile.css'
import { useSelector, useDispatch } from 'react-redux'
import { updateUser } from '../store/slices/authSlice'
import axiosInstance from '../api/api'
import toast, { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Box, Button, Divider, Grid, IconButton, InputAdornment, InputLabel, TextField, Typography } from '@mui/material'
import useScreenSize from '../hooks/useScreenSize'
import { VisibilityOff, Visibility } from "@mui/icons-material";

var AWS = require('aws-sdk');
function Profile() {
    const [file, setFile] = useState(null);
    const [email, setEmail] = useState()
    const [namee, setName] = useState('')
    const [username, setUsername] = useState()
    const [profileImage, setProfileImage] = useState('')
    const [fileName, setFileName] = useState('')

    const [view, setView] = useState('hs')
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
    const userInfo = useSelector((state) => state.auth.userInfo)
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [disabled, setDisabled] = useState(true)
    const [showPassword, setShowPassword] = useState({
        currentPass: false,
        newPass: false,
        confirmPass: false,
    });
    const dispatch = useDispatch()
    const userData = {
        id: userInfo.id,
        email: email,
        name: namee,
        username: username,
        premium_user: userInfo.premium_user
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axiosInstance.patch(`/users/${userData.id}/update`, userData, { withCredentials: true });
            // remove this console.log after testing

            if (res.status === 200) {
                // alert.success("Login Successful");
                toast.success('Successfully Updated!')
                const userInfo = res.data.userInfo
                console.log("from data", userInfo);
                dispatch(updateUser(userData))
            }
        } catch (error) {
            if (error.response) {
                console.log(error.response);
                toast.error(error.response.data.message)
            } else if (error.request) {
                toast.error('network error')
                console.log("network error");
            } else {
                toast.error(error)
            }
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()
        console.log("changing password");
        if (currentPassword === "" || newPassword === "" || confirmPassword === "") {
            toast.error("All fields are required")
            return
        }
        if (newPassword !== confirmPassword) {
            toast.error("New Passwords do not match")
            return
        }

        const data = {
            currentPassword: currentPassword,
            newPassword: newPassword
        }
        console.log(data);

        await axiosInstance.patch(`/auth/update-password/${userData.id}`, data, { withCredentials: true })
            .then((response) => {
                console.log(response);
                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
                toast.success('Password Changed Successfully!')
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.response.data.message)
            });

    }
    var config = {
        accessKeyId: "pPAzlk6rv4x34C6GoJEd",
        secretAccessKey: "aYuVmUYJonn7ESKAcDOop1O2dEca0v3RipG3FUUx",
        endpoint: "readyle.live:9000",
        sslEnabled: false,
        forcePathStyle: true
    };
    AWS.config.update(config);
    const s3Client = new AWS.S3();


    const saveFile = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
        const data = new FileReader();
        data.readAsDataURL(e.target.files[0]);
        data.addEventListener("load", function () {
            setFile(data.result);
        });
        console.log(typeof (file));

    };
    const uploadImage = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('file', file);
        formData.append("fileName", fileName);
        // const response = await s3Client.putObject({ Bucket: 'minio', Key: `docopypaste/profile/${file.name}`, Body: `${file}` })
        // if (!response) {
        //    console.log("error uploading file");
        // }
        try {
            await axiosInstance.post(`user/updateProfileImage/${userData.id}`, { file: file, username: username }, { withCredentials: true })
                .then((response) => {
                    console.log(response);
                })

                .catch((error) => { console.log(error); });
        } catch (error) {
            console.error(error);
        }
        const fetchProfile = async () => {

            const ne = await s3Client.getSignedUrl('getObject', { Bucket: 'minio', Key: `docopypaste/profile/${userInfo.username}/profile.png`, Expires: 60 * 60 })
            console.log(ne);
            setProfileImage(ne)
        }

        fetchProfile().catch((error) => { console.log(error); })

        console.log("Successfully uploaded data to myBucket/myKey");
    }
    useEffect(() => {

        console.log("auth from profile", isLoggedIn);
        console.log("userInfo from profile", JSON.stringify(userInfo));
        setView("profile-overview")
        setEmail(userInfo.email)
        setName(userInfo.name)
        setUsername(userInfo.username)

        const fetchProfile = async () => {

            const ne = await s3Client.getSignedUrl('getObject', { Bucket: 'minio', Key: `docopypaste/profile/${userInfo.username}/profile.png`, Expires: 60 * 60 })
            console.log(ne);
            setProfileImage(ne)
        }

        fetchProfile().catch((error) => { console.log(error); })
        try {
            const res = axiosInstance.get(`user/getProfile/${userData.id}`, { withCredentials: true })
                .then((response) => {

                    response.data.signedUrl ? setProfileImage(response.data.signedUrl) : setProfileImage("assets/img/profile-img.jpg")

                    // if (response.data.content !== null) sethasContent(true); else sethasContent(false);
                })
                .catch((error) => {
                    console.log(error);
                });
            // remove this console.log after testing


        } catch (error) {
            console.error(error);
        }

    }, []);

    const [isMobileView] = useScreenSize();

    return (
        <>
            <div><Toaster position='bottom-right' reverseOrder={false}/></div>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    padding: isMobileView ? "20px !important" : "40px !important",
                    background: "#fff",
                    gap: "30px",
                    borderRadius: "8px",
                    flex: 1,
                    margin: "105px 75px"
                }}
            >
                <Typography sx={{paddingX: "15px", fontWeight: "bold"}}>
                    Profile
                </Typography>
                <Divider sx={{borderBottom: "1px solid #e6e8eb"}} />
                <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <InputLabel sx={{fontWeight: "bold"}}>
                            First Name
                        </InputLabel>
                        <TextField
                            variant="outlined"
                            placeholder="FullName"
                            name="name"
                            value={namee}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            fullWidth
                            sx={{
                                "& input": { padding: "8px 16px !important" },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <InputLabel sx={{fontWeight: "bold"}}>
                            User Name
                        </InputLabel>
                        <TextField
                            variant="outlined"
                            placeholder="User Name"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            fullWidth
                            sx={{
                                "& input": { padding: "8px 16px !important" },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <InputLabel sx={{fontWeight: "bold"}}>
                            Email
                        </InputLabel>
                        <TextField
                            variant="outlined"
                            placeholder="Email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            fullWidth
                            sx={{
                                "& input": { padding: "8px 16px !important" },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <InputLabel sx={{fontWeight: "bold"}}>
                            Avatar
                        </InputLabel>
                        <input name="profileImage" onChange={saveFile} type="file" className="form-control" id="profileImage" />
                    </Grid>
                    <Grid item xs={12}>
                        <Button 
                            variant='contained'
                            sx={{
                                borderRadius: "6px",
                                textTransform: "none",
                                fontWeight: "bold",
                                background: "#0d6efd",
                                "&:hover": {
                                    background: "#0d6efd",
                                },
                            }}
                            type="submit" 
                            onSubmit={handleSubmit}
                        >
                            Update
                        </Button>
                    </Grid>
                </Grid>
                </form>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    padding: isMobileView ? "20px !important" : "40px !important",
                    background: "#fff",
                    gap: "30px",
                    borderRadius: "8px",
                    flex: 1,
                    margin: "25px 75px"
                }}
            >
                <Typography sx={{paddingX: "15px", fontWeight: "bold"}}>
                    Change Password
                </Typography>
                <Divider sx={{borderBottom: "1px solid #e6e8eb"}} />
                    <form onSubmit={handleChangePassword}>
                <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <InputLabel sx={{fontWeight: "bold"}}>
                                Current Password
                            </InputLabel>
                            <TextField
                                variant="outlined"
                                placeholder="Enter current password"
                                name="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                fullWidth
                                sx={{
                                    "& input": { padding: "8px 16px !important" },
                                }}
                                type={showPassword.currentPass ? "text" : "password"}
                                InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {" "}
                                        {showPassword.currentPass ? (
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    setShowPassword(pre => ({...pre, currentPass: false}))
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
                                                    setShowPassword(pre => ({...pre, currentPass: true}))
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
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <InputLabel sx={{fontWeight: "bold"}}>
                                New Password
                            </InputLabel>
                            <TextField
                                variant="outlined"
                                placeholder="New Password"
                                name="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                fullWidth
                                sx={{
                                    "& input": { padding: "8px 16px !important" },
                                }}
                                type={showPassword.newPass ? "text" : "password"}
                                InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {" "}
                                        {showPassword.newPass ? (
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    setShowPassword(pre => ({...pre, newPass: false}))
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
                                                    setShowPassword(pre => ({...pre, newPass: true}))
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
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <InputLabel sx={{fontWeight: "bold"}}>
                                Confirm new Password
                            </InputLabel>
                            <TextField
                                variant="outlined"
                                placeholder="Confirm new Password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                fullWidth
                                sx={{
                                    "& input": { padding: "8px 16px !important" },
                                }}
                                type={showPassword.confirmPass ? "text" : "password"}
                                InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {" "}
                                        {showPassword.confirmPass ? (
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    setShowPassword(pre => ({...pre, confirmPass: false}))
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
                                                    setShowPassword(pre => ({...pre, confirmPass: true}))
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
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button 
                            variant='contained'
                            onSubmit={handleChangePassword}
                            sx={{
                                    borderRadius: "6px",
                                    background: "#0d6efd",
                                    textTransform: "none",
                                    "&:hover": {
                                        background: "#0d6efd",
                                    },
                                    fontWeight: "bold",
                                }}
                            >
                                Change Passsword
                            </Button>
                        </Grid>
                </Grid>
                    </form>
            </Box>
        </>
    )
}

export default Profile