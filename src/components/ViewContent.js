import React from 'react'
import { Link } from "react-router-dom";
import { useEffect } from 'react';
import axiosInstance from '../api/api'
import { useSelector } from 'react-redux'
import Calendar from 'react-calendar';
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
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../assets/popup.css';
import toast, { Toaster } from 'react-hot-toast';
import InputGroup from 'react-bootstrap/InputGroup';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

function ViewContent() {

    const userInfo = useSelector((state) => state.auth.userInfo)
    const userId = userInfo.id

    const [hasContent, sethasContent] = useState(false)
    const [title, setTitle] = useState("")
    const [permission, setPermission] = useState(0)
    const [content, setContent] = useState(`Edit me!`)
    const [date, setDate] = useState(new Date());
    const [newContent, setNewContent] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [newIsChecked, setNewIsChecked] = useState(false);
    const [username, setUserName] = useState("");
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);
    const handlePermission = (e) => {
        setPermission(e.target.value);
    }
    const modules = {
        toolbar: [
        ],
    };
    const formats = [];
    const handleCreateNewContent = async (e) => {
        e.preventDefault();
        const contentData = {
            content: newContent,
            is_protected: newIsChecked,
            title: newTitle
        };
        setNewContent("")
        setNewTitle("")
        setNewIsChecked(false)
        console.log(contentData);
        socket.emit("message", ({ room: username, message: contentData }));
        try {
            const res = await axiosInstance.post(`/content/create/${userId}`, contentData, { withCredentials: true });
            if (res.status === 201) {
                toast.success("data added Successfully");
                closeModal();
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
        getinitialData();
    };
    const handleSubmit = (e) => {
        console.log("permission =", permission);
        e.preventDefault();
        try {
            axiosInstance.post(`/permission/create/${userId}`, { userList: username, permission_type: permission, permission_current_period_end: date }, { withCredentials: true })
                .then((response) => {
                    console.log("init.response =", response);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        catch (error) {
            if (error.response) {
                console.log(error.response);
                alert(error.response.data.message);
            } else if (error.request) {
                console.log("network error");
            } else {
                console.log(error);
            }
        }
    }
    const getinitialData = async () => {
        try {
            axiosInstance.get(`/content/getcontent/${userId}`, { withCredentials: true })
                .then((response) => {
                    console.log("init.response =", response);
                    setContent(response.data.content);
                    setTitle(response.data.title);
                    sethasContent(true)
                    // console.log("hasContent =", hasContent)
                })
                .catch((error) => {
                    console.log(error);
                    sethasContent(false)
                    // console.log("hasContent =", hasContent)
                });
        }
        catch (error) {
            if (error.response) {
                console.log(error.response);
                alert(error.response.data.message);
            } else if (error.request) {
                console.log("network error");
            } else {
                console.log(error);
            }
        }
    }
    useEffect(() => {

        newEvent("view content", "view content", "/view-content");

        socket.emit('join_room', userInfo.username);
        socket.on('message', (data) => {
            console.log("data from server", data);
            setContent(data.content);
        });

        try {
            axiosInstance.get(`/content/getcontent/${userId}`, { withCredentials: true })
                .then((response) => {
                    console.log("init.response =", response);
                    setContent(response.data.content);
                    setTitle(response.data.title);
                    sethasContent(true)
                    // console.log("hasContent =", hasContent)
                })
                .catch((error) => {
                    console.log(error);
                    sethasContent(false)
                    // console.log("hasContent =", hasContent)
                });
        }
        catch (error) {
            if (error.response) {
                console.log(error.response);
                alert(error.response.data.message);
            } else if (error.request) {
                console.log("network error");
            } else {
                console.log(error);
            }
        }

    }, []);
    return (
        <>
            <Container className="mt-4">
                <Container  >
                    <Row  >
                        <Col className=' d-flex justify-content-cente'>
                        <button className="btn btn-primary" onClick={() => setOpen(o => !o)}> <FaPlus /> Create New Content </button>
                            <Popup open={open} closeOnDocumentClick onClose={closeModal}>
                                <Form onSubmit={handleCreateNewContent}>
                                    <InputGroup className="mb-3">
                                        <Button type="submit" className="btn btn-primary btn-block">
                                            Create Contact
                                        </Button>
                                    </InputGroup>

                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label  >Title</Form.Label>
                                        <Form.Control type="text" value={newTitle} placeholder="Title" onChange={e => setNewTitle(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            label="Protected Content"
                                            checked={newIsChecked}
                                            name="protected_content"
                                            id="protected_content"
                                            onChange={e => setNewIsChecked(e.target.checked)}
                                        />
                                    </Form.Group>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data="<p>Hello from CKEditor&nbsp;5!</p>"
                                        onReady={editor => {
                                            console.log("Editor is ready to use!", editor);
                                        }
                                        }
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            setNewContent(data)
                                            // console.log({ data });
                                        }}
                                    />
                                </Form>
                            </Popup>
                        </Col>
                    </Row>
                </Container>
                {hasContent ? (
                    <>
                        <div className="container card rounded bg-white mb-5" style={{ marginBottom: "100px" }}>
                            <div className="row">
                                <div className="col-md-6 border-right">
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="text-right">User Content</h4>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-md-24 card-body mb-4">
                                        <label className="labels" >{title}</label>
                                        <Container style={{ minHeight: "715px", marginTop: "50px" }}>
                                            <Row >
                                            {content.map((e) => (
                                                <Col>
                                                    <Card key={content._id} style={{ width: '18rem' }}>
                                                        <Card.Body>
                                                            <Card.Title>{e.title}</Card.Title>
                                                            <Card.Text>
                                                                {e.content}
                                                            </Card.Text>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))}
                                            </Row>
                                            <Link className="btn btn-primary btn-block mb-4" to="/create-content"> Add new Content</Link>


                                        </Container>
                                        {/* <ReactQuill
                                            modules={modules}
                                            formats={formats}
                                            style={{ height: "auto", marginBottom: "50px", border: "none" }}

                                            readOnly={true}
                                            value={content}
                                        /> */}
                                    </div>
                                    <Link className="btn btn-primary btn-block mb-4" to="/create-content">Edit content</Link>
                                </div>
                                <form className="row g-3 needs-validation" onSubmit={handleSubmit} >
                                    <div className="col-12">


                                        <label htmlFor="userlist" className="form-label">Username or Email of users</label>
                                        <div className="input-group has-validation">
                                            <div className="dropdown">

                                                <select value={permission} onChange={handlePermission} className=" btn btn-secondary dropdown-toggledropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                    <option className="dropdown-item" value="0" href="#">None</option>
                                                    <option className="dropdown-item" value="1" href="#">Read Only</option>
                                                    <option className="dropdown-item" value="2" href="#">Read and Write</option>
                                                </select>
                                            </div>
                                            <input type="text" name="username" className="form-control" value={username} id="userlist" onChange={e => setUserName(e.target.value)} required />
                                            <div className="invalid-feedback">Please enter your username.</div>
                                        </div>
                                    </div>
                                    <Calendar onChange={setDate} value={date} />

                                    <div className="col-12">
                                        <button className=" w-100 button-54" type="submit">give permission</button>
                                    </div>

                                </form>

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
                                                Add new content clieck on the button below
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