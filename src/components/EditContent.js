import { useState } from "react";
import React from "react";
import { useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import axiosInstance from "../api/api";
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from "react-redux";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "../assets/content.css";
import { socket } from "../api/socket";
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import { Button } from 'react-bootstrap';

function Content() {
    
    const [title, setTitle] = useState("")
    const [isChecked, setIsChecked] = useState(false);
    const [content, setContent] = useState("");
    const [subdomain, setSubdomain] = useState("");
    const userInfo = useSelector((state) => state.auth.userInfo);
    const navigate = useNavigate()

    const userId = userInfo.id;
    const username = userInfo.username;
    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-2" },
                { indent: "+2" },
            ],
            ["link", "image"],
            ["clean"],
        ],
    };

    const formats = ["header","bold","italic","underline","strike","blockquote","list","bullet","indent","link","image",];

    const handleSubmit = async (e) => {
        e.preventDefault();
        const contentData = {
            content: content,
            is_protected: isChecked,
            title: title
        };
        console.log(contentData);
        socket.emit("message",({room:username, message:contentData}));
        try {
            const res = await axiosInstance.post(`/content/create/${userId}`, contentData, { withCredentials: true });
            // remove this console.log after testing
            // console.log(res);
            if (res.status === 201) {
                toast.success("data added Successfully");
                navigate("/content");
            }
        } catch (error) {
            if (error.response) {
                console.log(error.response);
                toast.error(error.response.data.message);
            } else if (error.request) {
                toast.error("network error");
            } else {
                toast.error(error);
            }
        }
    };
    const handlechange = (value) => {
        setContent(value);
        setIsChecked(!isChecked)
        //remove this console.log after testing
        // console.log(value, isChecked);
    };
    useEffect(() => {
            try {
                axiosInstance.get(`/content/getcontent/${userId}`, { withCredentials: true })
                    .then((response) => {
                        console.log("init.response =", response);
                        setContent(response.data.content);
                        if(response.data.is_protected === true){
                            setIsChecked(true);
                        }
                        // setIsChecked(response.data.is_protected);
                        console.log("hasContent =", content)
                    })
                    .catch((error) => {
                        console.log(error);
                        // console.log("hasContent =", hasContent)
                    });
            }
            catch (error) {
                if (error.response) {
                    console.log(error.response);
                } else if (error.request) {
                    console.log("network error");
                } else {
                    console.log(error);
                }
            }
    }, []);
    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <Container className="shadow-sm" style={{ marginTop: "50px", marginBottom: "50px" }} >
                <Row>
                    <Col >
                        <Form onSubmit={handleSubmit}>
                            <InputGroup className="mb-3">
                                <Button type="submit" className="btn btn-primary btn-block mb-4">
                                    Create Contact
                                </Button>
                            </InputGroup>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label  >Title</Form.Label>
                                <Form.Control type="text" placeholder="Title" onChange={(e)=>setTitle(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Protected Content"
                                    checked={isChecked}
                                    name="protected_content"
                                    id="protected_content"
                                    onChange={(e) => setIsChecked(e.target.checked)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <div
                                id="editor-container"
                                value={content}
                                onChange={(value) => handlechange(value)}
                            >

                                <CKEditor
                                    editor={ClassicEditor}
                                    data="<p>Hello from CKEditor&nbsp;5!</p>"
                                    onReady={editor => {
                                        // set default text when editor is ready
                                        editor.setData(content);
                                        // You can store the "editor" and use when it is needed.
                                        console.log("Editor is ready to use!", editor);
                                    }
                                    }
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setContent(data)
                                        // console.log({ data });
                                    }}

                                />
</div>
                            </Form.Group>
                        </Form>
                    </Col>

                </Row>
            </Container>


        </>
    );
}

export default Content;