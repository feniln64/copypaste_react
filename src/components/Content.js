import { useState } from "react";
import React from "react";
import psl from 'psl';
import { useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axiosInstance from "../api/api";
import toast, { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from "react-redux";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "../assets/content.css";
import { Redis } from "@upstash/redis"
import { socket } from "../api/socket";
import { Link, useNavigate } from "react-router-dom";

function Content() {
    var parsed = psl.parse(window.location.hostname);
    const subdomain = parsed.subdomain
    const [hasContent, sethasContent] = React.useState(false)
    const [isChecked, setIsChecked] = useState(false);
    const [content, setContent] = useState("");
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

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
    ];
    const [code, setCode] = React.useState(
        `function add(a, b) {\n  return a + b;\n}`
    );

    const handlechange = (value) => {
        setContent(value);
        setIsChecked(!isChecked)
        //remove this console.log after testing
        // console.log(value, isChecked);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const contentData = {
            content: content,
            is_protected: isChecked,
        };
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

    useEffect(() => {
        // socket.emit('join_room', username);
        if (subdomain === null) {
            // remove this
            // alert("subdomain is null")
            try {
                axiosInstance.get(`/content/getcontent/${userId}`, { withCredentials: true })
                    .then((response) => {
                        // console.log("init.response =", response);
                        setContent(response.data);
                        // console.log("hasContent =", hasContent)
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

        }
        else {
            try {
                axiosInstance.post(`/init`, { subdomain: subdomain })
                    .then((response) => {
                        // console.log("init.response =", response);
                        setContent(response.data);
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
    }, []);
    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div id="main" className="services" style={{ marginLeft: "auto", height: "vh", width: "auto" }}>
                <div className="container" data-aos="fade-up" style={{ width: "auto" }}>
                    <section className=" card-body ">
                        <form onSubmit={handleSubmit}>
                            <button type="submit" className="btn btn-primary btn-block mb-4">
                                Create Contact
                            </button>
                            <div className="form-check">
                                <label className="form-check-label" htmlFor="protected_content">
                                    Protected Content
                                </label>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value=""
                                    checked={isChecked}
                                    name="protected_content"
                                    id="protected_content"
                                    onChange={(e) => setIsChecked(e.target.checked)}
                                />
                            </div>
                        
                            <div
                                id="editor-container"
                                value={content}
                                onChange={(value) => handlechange(value)}
                            ></div>
                            <div>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data="<p>Hello from CKEditor&nbsp;5!</p>"
                                    onReady={(editor) => {
                                        // You can store the "editor" and use when it is needed.
                                        console.log("Editor is ready to use!", editor);
                                    }}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setContent(data)
                                        // console.log({ data });
                                    }}
                                    onBlur={(event, editor) => {
                                        // console.log("Blur.", editor);
                                    }}
                                    onFocus={(event, editor) => {
                                        // console.log("Focus.", editor);
                                    }}
                                />
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </>
    );
}

export default Content;
{
    /* <div className="form-outline mb-4">
                          <CodeEditor
                              value={content}
                              language="js"
                              placeholder="Please enter JS code."
                              onChange={(evn) => setCode(evn.target.value)}
                              padding={15}
                              style={{
                                  fontSize: 12,
                                  backgroundColor: "#f5f5f5",
                                  fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                              }}
                          />
                      </div> */
}

{
    /* See what is being written */
}
{
    /* <div style={{border: "1px solid black"}} className="form-outline mb-4">
                          <ReactQuill
                              value={content}
                              readOnly={true}
                              theme={"bubble"}
                          />
                      </div> */
}
