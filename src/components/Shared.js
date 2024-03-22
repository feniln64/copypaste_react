/* eslint-disable*/
import React from 'react'
import { useEffect } from 'react';
import axiosInstance from '../api/api'
import { useSelector, useDispatch } from 'react-redux'
import {initSharedWithMe, removeSharedWithMe,removeOneSharedWithMe, addNewSharedWithMe} from '../store/slices/sharedWithMeSlice'
import 'react-calendar/dist/Calendar.css';
import '../assets/content.css';
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
import 'reactjs-popup/dist/index.css';
import '../assets/popup.css';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { CommonDialog, CardView } from '../common';
import { RiEditBoxFill } from "react-icons/ri";

function Shared() {

    const dispatch = useDispatch()
    const userInfo = useSelector((state) => state.auth.userInfo)
    const username = userInfo.username                                                                                                  
    const userEmail = userInfo.email

    const isContent = useSelector((state) => state.sharedwithme.sharedwithme)
    const [hasPermission, setHasPermission] = useState(false)
    // const [content, setContent] = useState([])

    const [newContent, setNewContent] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [newIsChecked, setNewIsChecked] = useState(false);

    const [modelId, setModelId] = useState("")
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

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
            <Container className="mt-4">
                {hasPermission ? (
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
                                                   <Card id={e._id} style={{ width: '18rem' }}>
                                                       <Card.Body>
                                                           <Button className='mt-2' onClick={() => e.editContent(e._id)}><RiEditBoxFill /></Button>{' '}
                                                           <Card.Title>{e.title}</Card.Title>
                                                           <Card.Text>
                                                               <ReactQuill
                                                                   modules={{ toolbar: false}}
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
                                            </Row>
                                        </Container>
                                    </div>
                                    <div className="d-flex justify-content-center align-items-center">
                                        {/* Update Content Model  */}
                                        <CommonDialog open={show} onClose={handleClose} onClick={handleUpdateContent} title={"Create New Content"}>
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
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <Container style={{ minHeight: "715px", marginTop: "50px" }}>
                            <Row >
                                <Col className='d-flex justify-content-center'>
                                    <Card style={{ width: '18rem' }}>
                                        <Card.Body>
                                            <Card.Title>No Content</Card.Title>
                                            <Card.Text>
                                                No shared content with you
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>
                    </>
                )
                }
            </Container >
        </>
    )
}


export default Shared;