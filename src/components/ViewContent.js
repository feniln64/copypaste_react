/* eslint-disable*/
import React from 'react'
import { useEffect } from 'react';
import axiosInstance from '../api/api'
import { useSelector, useDispatch } from 'react-redux'
import { addContent, updateContent, updateOneContent, removeOneContent } from '../store/slices/contentSlice';
import { initSharedBy, removeSharedBy, removeOneSharedBy, addNewSharedBy } from '../store/slices/sharedBySlice';
import 'react-calendar/dist/Calendar.css';
import { useState } from 'react';
import newEvent from '../api/postHog';
import { socket } from "../api/socket";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FaPlus } from "react-icons/fa6";
import 'reactjs-popup/dist/index.css';
import '../assets/popup.css';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { CommonDialog, CardView } from '../common';
import { Box, Grid, Typography, Button as MUIButton, MenuItem,Select as MUISelect,InputLabel } from '@mui/material';
import useScreenSize from '../hooks/useScreenSize';
import { Select } from 'antd';
import { DatePicker, Space } from 'antd';
const { RangePicker } = DatePicker;
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ModelTraining } from '@mui/icons-material';
dayjs.extend(customParseFormat);
function ViewContent() {

    const dateFormat = 'MM-DD-YYYY';
    const options = [];
    const today = dayjs().format(dateFormat);
    const dispatch = useDispatch()  
    const userInfo = useSelector((state) => state.auth.userInfo)
    const username = userInfo.username
    const userId = userInfo.id

    const isContent = useSelector((state) => state.content.content)
    const [hasContent, sethasContent] = useState(false)
    // const [content, setContent] = useState([])

    const [permissionType, setPermissionType] = useState(0)
    const [date, setDate] = useState(new Date());

    const [newContent, setNewContent] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [newIsChecked, setNewIsChecked] = useState(false);

    const [modelId, setModelId] = useState("")
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const [deleteModelId, setDeleteModelId] = useState("")
    const [deleteShow, setDeleteShow] = useState(false);
    const [deleteTitle, setDeleteTitle] = useState("")
    const handleDeleteClose = () => setDeleteShow(false);

    const [permissionShow, setPermissionShow] = useState(false)
    const [editModelId, setEditModelId] = useState("")
    const [users, setUsers] = useState([])
    const handlePermissionClose = () => setPermissionShow(false);

    const handlePermission = (e) => {
        e.preventDefault();
        const data = {
            userList: users,
            permission_current_period_end: date,
            permission_type: permissionType
        }
        // dispatch(addNewSharedBy(res.data.message.sharedbyMe))
    }

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
            title: newTitle,
            is_shared: false
        };
        console.log("contentData =", contentData);

        socket.emit("updateContent", ({ room: username, message: contentData }));

        await axiosInstance.patch(`/content/update/${modelId}`, contentData, { withCredentials: true })
            .then((response) => {
                if (response.status === 200) {
                    console.log("response.data.updatedContent", response.data.updatedContent);
                    dispatch(updateOneContent(response.data.updatedContent))
                    // getinitialData()
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

    const handleCreateNewContent = async (e) => {
        e.preventDefault();
        console.log("create new content called");
        if (newContent === "" || newTitle === "") {
            handleClose()
            return
        }
        const contentData = {
            content: newContent,
            is_protected: newIsChecked,
            title: newTitle,
            is_shared: false
        };
        setNewTitle("")
        setNewIsChecked(false)
        setNewContent("")

        socket.emit("newContent", ({ room: username, message: contentData }));

        await axiosInstance.post(`/content/create/${userId}`, contentData, { withCredentials: true })
            .then((response) => {
                if (response.status === 201) {
                    // setContent(response.data.content);
                    sethasContent(true)
                    dispatch(addContent(response.data.content))
                    handleClose();
                    toast.success("data added Successfully");
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
    };

    const getinitialData = async () => {
        await axiosInstance.get(`/content/getcontent/${userId}`, { withCredentials: true })
            .then((response) => {
                // setContent(response.data.content);
                sethasContent(true)
                dispatch(addContent(response.data.content))
                dispatch(initSharedBy(response.data.sharedByMe))
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
            });
    }

    useEffect(() => {
        getinitialData()
        if (isContent.length > 0) {
            sethasContent(true)
        }
        newEvent("view content", "view content", "/view-content");

        socket.emit('join_room', userInfo.username);
        socket.on('message', (data) => {
            console.log("data from server", data);
            setContent(data.content);
        });
    }, []);

    const openModal = (event) => {
        setModelId(event)
        if (event === "createContent") {
            setNewTitle("")
            setNewIsChecked(false)
            setNewContent("")
        } else {
            setNewContent(isContent.filter((e) => e._id === event)[0].content || "")
            setNewTitle(isContent.filter((e) => e._id === event)[0].title || "")
            setNewIsChecked(isContent.filter((e) => e._id === event)[0].is_protected || false)
            // handleUpdateShow()
        }
        setShow(true);
    };

    const deleteModel = (event) => {
        setDeleteTitle(isContent.filter((e) => e._id === event)[0].title || "")
        setDeleteModelId(event)
        setDeleteShow(true);
    };

    const permissionModel = (event) => {
        console.log("permissionModel called");
        setPermissionShow(true);
    };

    const addUsers = async (value) => {
        console.log("value =", value);
        setUsers(value);
        console.log("users =", users);
    }

    const handleDeleteContent = async (e) => {
        e.preventDefault();
        await axiosInstance.delete(`/content/delete/${deleteModelId}`, { withCredentials: true })
            .then((response) => {
                if (response.status === 201) {
                    dispatch(removeOneContent({ _id: deleteModelId }))
                    setDeleteShow(false);
                    setContent(isContent)
                    toast.success("data deleted Successfully");
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
            });
        setDeleteTitle("");
        setDeleteModelId("");
        setDeleteShow(false);
    };

    const [isMobileView] = useScreenSize();
    const { RangePicker } = DatePicker;
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
                        <Grid item xs={12} md={4} sx={{ padding: "20px" }}>
                            <Box sx={{ width: isMobileView ? "auto" : "18rem", borderRadius: "8px" }}>
                                <CardView title={e.title} editContent={openModal} editPermission={permissionModel} deleteContent={deleteModel} content={e.content} _id={e._id} />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <MUIButton variant="contained" sx={{ width: "fit-content", textTransform: "capitalize" }} onClick={e => openModal(e.target.id)} id='createContent'> <FaPlus />Create New Content </MUIButton>
                </Box>
            </Box>
            <div className="d-flex justify-content-center align-items-center">
                {/* Update Content Model  */}
                <CommonDialog open={show} onClose={handleClose} onClick={modelId === "createContent" ? handleCreateNewContent : handleUpdateContent} title={"Create New Content"}>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Title</Form.Label>
                            {/* <input type="text" placeholder="Title" value={newTitle} autoFocus /> */}
                            <Form.Control type="text" placeholder="Title" onChange={e => setNewTitle(e.target.value)} value={newTitle} autoFocus />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Protected Content</Form.Label>
                            <Form.Check // prettier-ignore
                                type={"checkbox"}
                                id={"protected_content"}
                                label="Protected Content"
                                checked={newIsChecked}
                                onChange={e => setNewIsChecked(e.target.checked)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <CKEditor
                                editor={ClassicEditor}
                                data={newContent}
                                config={{ placeholder: "Placeholder text..." }}
                                onReady={editor => { }}
                                onChange={(event, editor) => {
                                    setNewContent(editor.getData())
                                }}
                            />
                        </Form.Group>
                    </Form>
                </CommonDialog>
                {/* Delete Content Model  */}
                <Modal show={deleteShow} backdrop="static" aria-labelledby="contained-modal-title-vcenter" centered onHide={handleDeleteClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Content "{deleteTitle}" ?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>To confirm deletion, Click on Delete Content.</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleDeleteClose}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDeleteContent}>
                            Delete Content
                        </Button>
                    </Modal.Footer>
                </Modal>
                {/* permission Model */}
                <Modal show={permissionShow} backdrop="static" aria-labelledby="contained-modal-title-vcenter" centered onHide={handlePermissionClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Permission</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Users List</Form.Label>
                            <Select
                                mode="tags"
                                style={{ width: '100%' }}
                                open={false}
                                onChange={addUsers}
                                placeholder="enter user email and press enter"
                                options={options}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Pick Date till want to give permission!</Form.Label>
                            <Form.Control min={today}  type="date" placeholder="Date" onChange={e => setDate(e.target.value)} />
                            
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <MUISelect labelId="selct-permission-type"  id="selct-permission-type" value={permissionType} label="Permission Type" onChange={e => setPermissionType(e.target.value)}>
                                <MenuItem value={0}>Permission Type</MenuItem>
                                <MenuItem value={1}>Read</MenuItem>
                                <MenuItem value={2}>Read & Write</MenuItem>
                            </MUISelect>
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handlePermissionClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handlePermission} >
                            Give Permission
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}


export default ViewContent