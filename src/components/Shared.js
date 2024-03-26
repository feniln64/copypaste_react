/* eslint-disable*/
import React from 'react'
import { useEffect } from 'react';
import axiosInstance from '../api/api'
import { useSelector, useDispatch } from 'react-redux'
import { initSharedWithMe, removeSharedWithMe } from '../store/slices/sharedWithMeSlice'
import 'react-calendar/dist/Calendar.css';
import '../assets/content.css';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import newEvent from '../api/postHog';
import { socket } from "../api/socket";
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import 'reactjs-popup/dist/index.css';
import '../assets/popup.css';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from 'react-bootstrap';
import { RiEditBoxFill } from "react-icons/ri";
import { Box, Grid, Typography } from '@mui/material';
import useScreenSize from '../hooks/useScreenSize';

function Shared() {

    const dispatch = useDispatch()
    const userInfo = useSelector((state) => state.auth.userInfo)
    const username = userInfo.username
    const userEmail = userInfo.email

    const isContent = useSelector((state) => state.sharedwithme.sharedwithme)
    const [hasPermission, setHasPermission] = useState(false)

    const [newContent, setNewContent] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [newIsChecked, setNewIsChecked] = useState(false);

    const [modelId, setModelId] = useState("")
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [isMobileView] = useScreenSize();

    const handleUpdateContent = async (e) => {
        e.preventDefault();
        if (newContent === "" || newTitle === "") {
            handleClose()
            return
        }
        const contentData = {
            _id: modelId,
            content: newContent,
            is_protected: newIsChecked,
            title: newTitle
        };
        console.log("contentData =", contentData);

        socket.emit("updateContent", ({ room: username, message: contentData }));

        await axiosInstance.patch(`/content/update/${modelId}`, contentData, { withCredentials: true })
            .then((response) => {
                if (response.status === 200) {
                    dispatch(updateOneContent(contentData))
                    // setContent(isContent)
                    handleClose()
                    toast.success("data updated Successfully");
                }
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response);
                    toast.error(error.response.data.message);
                } else if (error.request) {
                    console.log("network error");
                } else {
                    console.log(error);
                }
            })
        setNewTitle(""); setNewIsChecked(false); setNewContent("")
    };

    const getinitialData = async () => {
        console.log(" got data from server")
        await axiosInstance.get(`permission/shared/withme/${userEmail}`, { withCredentials: true })
            .then((response) => {
                setHasPermission(true)
                dispatch(initSharedWithMe(response.data.sharedContent))
                console.log("response.data.sharedContent", response.data.sharedContent)
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response);
                    toast.error(error.response.data.message);
                    if (error.response.status === 401) {
                        dispatch(removeSharedWithMe())
                    }
                } else if (error.request) {
                    console.log("network error");
                } else {
                    console.log(error);
                }
            });
    }

    useEffect(() => {
        getinitialData()
        if (isContent.length > 0) {
            setHasPermission(true)
        }
        newEvent("view permission to me", "permission", "/shared");

        // socket.emit('join_room', userInfo.username);
        // socket.on('message', (data) => {
        //     console.log("data from server", data);
        //     dispatch(initSharedWithMe(response.data.sharedContent))
        // });
    }, []);

    const openModal = (event) => {
        setNewContent(isContent.filter((e) => e._id === event)[0].content || "")
        setNewTitle(isContent.filter((e) => e._id === event)[0].title || "")
        setNewIsChecked(isContent.filter((e) => e._id === event)[0].is_protected || false)
        setShow(true);
    };

    return (
        <>
            <Toaster position='bottom-right' reverseOrder={false} />
           
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    padding: isMobileView ? "20px !important" : "40px !important",
                    background: "#fff",
                    gap: "30px",
                    borderRadius: "8px",
                    flex: 1,
                    margin: isMobileView ? "25px 10px" : "25px 105px",
                    boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px",
                }}
            >
                <Typography variant='h5' fontWeight={"bold"} textAlign={"center"}>User Content</Typography>
                <Grid container>
                    {isContent.map((e) => (
                        <Col key={e._id} id={e._id} >
                            <Card id={e._id} style={{ width: '18rem' }}>
                                <Card.Body>
                                    <Button className='mt-2' onClick={() => e.editContent(e._id)}><RiEditBoxFill /></Button>{' '}
                                    <Card.Title>{e.title}</Card.Title>
                                    <Card.Text>
                                        <ReactQuill
                                            modules={{ toolbar: false }}
                                            formats={[]}
                                            style={{ height: "auto", border: "none !important" }}
                                            readOnly={true}
                                            value={e.content}
                                        />
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Grid>

            </Box>
        </>
    )
}


export default Shared;