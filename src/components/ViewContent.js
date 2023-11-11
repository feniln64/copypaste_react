import React from 'react'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Link } from "react-router-dom";
import psl from 'psl';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useEffect } from 'react';
import axiosInstance from '../api/api'
import { useSelector, useDispatch } from 'react-redux'
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState } from 'react';


function ViewContent() {
    const userInfo = useSelector((state) => state.auth.userInfo)
    const dispatch = useDispatch()
    const userId = userInfo.id
    const [hasContent, sethasContent] = React.useState(false)
    const [permission, setPermission] = React.useState(0)
    const [content, setContent] = React.useState(`Edit me!`)
    var parsed = psl.parse(window.location.hostname);
    const subdomain = parsed.subdomain
    const [date, onChange] = useState(new Date());

    const [username, setUserName] = useState("");
    const handlePermission = (e) => {
        setPermission(e.target.value);
    }
    const handleSubmit = (e) => {
        console.log("permission =", permission);
        e.preventDefault();
        try {
            axiosInstance.post(`/permission/create/${userId}`, { userList: username,permission_type:permission, permission_current_period_end: date }, { withCredentials: true })
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

    useEffect(() => {
        if (subdomain === null) {
            // remove this
            // alert("subdomain is null")
            try {
                axiosInstance.get(`/content/getcontent/${userId}`, { withCredentials: true })
                    .then((response) => {
                        console.log("init.response =", response);
                        setContent(response.data);
                        sethasContent(true)
                        console.log("hasContent =", hasContent)
                    })
                    .catch((error) => {
                        console.log(error);
                        sethasContent(false)
                        console.log("hasContent =", hasContent)
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
        else {
            try {
                axiosInstance.post(`/init`, { subdomain: subdomain })
                    .then((response) => {
                        console.log("init.response =", response);
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
        console.log(parsed.sld);
        console.log("subdomain is " + parsed.sld)

    }, []);
    return (
        <>
            {hasContent ? (
                <>
                    <div className="container card rounded bg-white mt-5 mb-5" style={{ marginBottom: "100px" }}>
                        <div className="row">
                            <div className="col-md-6 border-right">
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right">User Content</h4>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-24 card-body">
                                    <label className="labels" >content</label>
                                    {content}
                                    <SyntaxHighlighter language="html" style={docco} wrapLongLines="true" >

                                    </SyntaxHighlighter>
                                    <Link className="btn btn-primary btn-block mb-4" to="/create-content">Edit content</Link>

                                </div>
                                <form className="row g-3 needs-validation" onSubmit={handleSubmit} >
                                    

                                    <div className="col-12">
                                        <label htmlFor="userlist" className="form-label">Username or Email of users</label>
                                        <div className="input-group has-validation">
                                            <div class="dropdown">
                                                
                                                <select  value={permission} onChange={handlePermission}  class=" btn btn-secondary dropdown-toggledropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                    <option class="dropdown-item" value="0" href="#">None</option>
                                                    <option class="dropdown-item" value="1" href="#">Read Only</option>
                                                    <option class="dropdown-item" value="2" href="#">Read and Write</option>
                                                </select>
                                            </div>
                                            <input type="text" name="username" className="form-control" value={username} id="userlist" onChange={e => setUserName(e.target.value)} required />
                                            <div className="invalid-feedback">Please enter your username.</div>
                                        </div>
                                    </div>
                                            <Calendar onChange={onChange} value={date} />

                                    <div className="col-12">
                                        <button className=" w-100 button-54" type="submit">give permission</button>
                                    </div>

                                </form>

                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <h1>has no content</h1>
                    <Link className="btn btn-primary btn-block mb-4" to="/create-content">Content</Link>
                </>
            )
            }
        </>
    )
}

export default ViewContent