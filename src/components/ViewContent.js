/* eslint-disable*/
import React from 'react'
import { Link } from "react-router-dom";
import { useEffect } from 'react';
import axiosInstance from '../api/api'
import Calendar from 'react-calendar';
import { useSelector, useDispatch } from 'react-redux'
import { addContent, updateContent, updateOneContent, removeOneContent } from '../store/slices/contentSlice';
import 'react-calendar/dist/Calendar.css';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import newEvent from '../api/postHog';
import { socket } from "../api/socket";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FaPlus } from "react-icons/fa6";
import 'reactjs-popup/dist/index.css';
import '../assets/popup.css';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { CommonDialog, CardView } from '../common';

function ViewContent() {

    const dispatch = useDispatch()
    const userInfo = useSelector((state) => state.auth.userInfo)
    const username = userInfo.username
    const userId = userInfo.id

    const isContent = useSelector((state) => state.content.content)
    const [hasContent, sethasContent] = useState(false)
    // const [content, setContent] = useState([])

    const [permission, setPermission] = useState(0)
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

    const handlePermission = (e) => {
        setPermission(e.target.value);
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
            title: newTitle
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

    return (
        <>
            <Toaster />
            <Container className="mt-4">
                {hasContent ? (
                    <>
                        <div className="container  card rounded bg-white" style={{ marginBottom: "100px" }}>
                            <div className="row">
                                <div className="d-flex justify-content-center align-items-center mt-3">
                                    <h4 className="text-right">User Content</h4>
                                </div>
                                <div className="row">
                                    <div className="col-md-24  card-body">
                                        <Container style={{ minHeight: "715px", marginTop: "50px" }}>
                                            <Row >
                                                {isContent.map((e) => (
                                                    <Col key={e._id} id={e._id} >
                                                        <CardView title={e.title} editContent={openModal} deleteContent={deleteModel} content={e.content} _id={e._id} />
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Container>
                                    </div>
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
                                        <button className="btn btn-primary mb-3" onClick={e => openModal(e.target.id)} id='createContent'> <FaPlus /> Create New Content </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <Container style={{ minHeight: "715px", marginTop: "50px" }}>
                            <Row >
                                <Col>
                                    <Card style={{ width: '18rem' }}>
                                        <Card.Body>
                                            <Card.Title>No Content</Card.Title>
                                            <Card.Text>
                                                Add new content click on the button below
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            <Link className="btn btn-primary btn-block mb-4" to="/create-content"> Add new Content</Link>
                        </Container>
                    </>
                )
                }
            </Container >
        </>
    )
}


export default ViewContent