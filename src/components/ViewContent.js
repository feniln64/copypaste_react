/* eslint-disable*/
import React,{ useEffect ,useState} from 'react'
import axiosInstance from '../api/api'
import { useSelector, useDispatch } from 'react-redux'
import { addContent, addNewContent, updateOneContent, removeOneContent } from '../store/slices/contentSlice';
import { initSharedBy, removeSharedBy, removeOneSharedBy, addNewSharedBy } from '../store/slices/sharedBySlice';
import newEvent from '../api/postHog';
import { socket } from "../api/socket";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FaPlus } from "react-icons/fa6";
import '../assets/popup.css';
import '../assets/content.css';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { CommonDialog, CardView } from '../common';
import { Box, Grid, Typography, Button as MUIButton, MenuItem, Select as MUISelect, InputLabel, OutlinedInput, Chip } from '@mui/material';
import useScreenSize from '../hooks/useScreenSize';
import { Select } from 'antd';
import { Container, Row, Col } from 'react-bootstrap';
import { AiOutlineClose } from "react-icons/ai";
var options = []

function ViewContent() {

    const dateFormat = 'MM-DD-YYYY';
    const dispatch = useDispatch()
    const userInfo = useSelector((state) => state.auth.userInfo)
    const username = userInfo.username
    const userId = userInfo.id
    
    const isContent = useSelector((state) => state.content.content)
    const permissions = useSelector((state) => state.sharedby.sharedby)
    const [hasContent, sethasContent] = useState(false)
    
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
    
    const [permissionType, setPermissionType] = useState(0)
    const [contentId, setContentId] = useState("")
    const [deletePermissionShow, setDeletePermissionShow] = useState(false);
    const [allowedUsers, setAllowedUsers] = useState([])
    const [deleteUser, setDeleteUser] = useState("")
    const [permissionShow, setPermissionShow] = useState(false)
    const [users, setUsers] = useState([])
    const handlePermissionClose = () => {setPermissionShow(false);options=[]};
    const handleDeletePermissionClose = () => setDeletePermissionShow(false);
    const handlePermission = async (e) => {
        e.preventDefault();
        const permissionData = {
            userList: users,
            permission_type: permissionType
        }
        setUsers([])
        setPermissionType(0)
        await axiosInstance.post(`permission/create/${contentId}`, permissionData, { withCredentials: true })
            .then((response) => {
                if (response.status === 201) {
                    dispatch(addNewSharedBy(response.data.sharedbyMe))
                    toast.success("permission sent Successfully");
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
        setPermissionShow(false);
    }

    const handleDeletePermission = async (e) => {
        e.preventDefault();
        console.log("deleteUser", deleteUser);
        console.log("contentId", contentId);
        // await axiosInstance.delete(`permission/delete/${deleteUser}/${contentId}`, { withCredentials: true })
        //     .then((response) => {
        //         if (response.status === 201) {
        //             dispatch(removeOneSharedBy({ contentId: contentId, userEmail: e.target.id }))
        //             toast.success("permission deleted Successfully");
        //         }
        //     })
        //     .catch((error) => {
        //         if (error.response) {
        //             console.log(error.response);
        //             toast.error(error.response.data.message);
        //         } else if (error.request) {
        //             console.log("network error");
        //         } else {
        //             console.log(error);
        //         }
        //     })
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

        socket.emit("updatecontent", ({ room: username, message: contentData }));

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

        await axiosInstance.post(`/content/create/${userId}`, contentData, { withCredentials: true })
            .then((response) => {
                if (response.status === 201) {
                    sethasContent(true)
                    dispatch(addNewContent(response.data.createdContent))
                    handleClose();
                    toast.success("data added Successfully");
                    socket.emit("newcontent", ({ room: username, message: response.data.createdContent }));
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
        setContentId(event)
        setPermissionShow(true);
        // console.log("permissions", permissions);
        setAllowedUsers([])
        permissions.filter((e) => e.contentId === event).map((e) => {
            setAllowedUsers(e.user_emails)
            for (let i = 0; i < e.user_emails.length; i++) {
                options.push({ label: e.user_emails[i], value: e.user_emails[i] })
            }
        })
        // console.log("allowedUsers", allowedUsers);
        console.log("options", options);
        // for (let i = 0; i < permissions.length; i++) {
        //     if (permissions[i].contentId === event) {
        //         console.log("permissions[i].allowedUsers", permissions[i].user_emails);
        //         setAllowedUsers(permissions[i].user_emails)
        //     }
        // }
        // console.log("allowedUsers", allowedUsers);
    };

    const handleDeleteContent = async (e) => {
        e.preventDefault();
        await axiosInstance.delete(`/content/delete/${deleteModelId}`, { withCredentials: true })
            .then((response) => {
                if (response.status === 201) {
                    dispatch(removeOneContent({ _id: deleteModelId }))
                    setDeleteShow(false);
                    toast.success("data deleted Successfully");
                    socket.emit("deletecontent", ({ room: username}));
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

    const addUsers = async (value) => {
        setUsers(value);

    }
    const handleDeletePermissionModel = (e) => {
        // console.log("e.target.id", e.target.id);
        // console.log("deleteUser", contentId);
        setDeleteUser(e.target.id)
        setDeletePermissionShow(true)
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
            console.log("data from server", data);
            // setContent(data.content);
        });
        socket.on('newcontent', (data) => {
            getinitialData()
        });

        socket.on('updatecontent', (data) => {
            getinitialData()
        });

    }, []);
        
    const [isMobileView] = useScreenSize();
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
                        <Grid key={e._id} item xs={12} md={4} sx={{ padding: "20px" }}>
                            <Box sx={{ width: isMobileView ? "auto" : "18rem", borderRadius: "8px" }}>
                                {/* {if (e.content.length > 10) e.content = e.content.slice(0, 10) + "..."} */}
                                <CardView title={e.title} editContent={openModal} editPermission={permissionModel} deleteContent={deleteModel} content={e.content.slice(0, 20) } _id={e._id} />
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
                {/* delete permission models */}
                <Modal show={deletePermissionShow} backdrop="static" aria-labelledby="contained-modal-title-vcenter" centered onHide={handlePermissionClose}>
                    <Modal.Header closeButton>
                        <Modal.Title> <h6>Delete Permission for  "{deleteUser}" ? </h6></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>To confirm deletion, Click on Delete User.</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleDeletePermissionClose}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDeletePermission}>
                            Delete User
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
                                // open={false}
                                onChange={addUsers}
                                placeholder="enter user email and press enter"
                                options={options}
                            />

                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <MUISelect labelId="selct-permission-type" id="selct-permission-type" value={permissionType} label="Permission Type" onChange={e => setPermissionType(e.target.value)}>
                                <MenuItem value={0}>Permission Type</MenuItem>
                                <MenuItem value={1}>Read</MenuItem>
                                <MenuItem value={2}>Read & Write</MenuItem>
                            </MUISelect>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Shared with</Form.Label>
                            <Container>
                                {allowedUsers.map((e) => (
                                    <Row>
                                        <Col xs={14} md={10} style={{ backgroundColor: "pink" }}>
                                            <Chip key={contentId} label={e} />
                                        </Col>
                                        <Col className='d-flex align-self-center justify-content-center' xs={4} md={2}>
                                            <AiOutlineClose id={e} onClick={handleDeletePermissionModel}/>
                                        </Col>
                                    </Row>
                                ))}
                            </Container>
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