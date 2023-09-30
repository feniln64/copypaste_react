import React from 'react'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Link } from "react-router-dom";
import psl from 'psl';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useEffect } from 'react';
import axiosInstance from '../api/api'
import { useSelector, useDispatch } from 'react-redux'
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css'

function ViewContent() {
    const userInfo = useSelector((state) => state.auth.userInfo)
    const dispatch = useDispatch()
    const userId = userInfo.id
    const [hasContent, sethasContent] = React.useState(false)
    const [content, setContent] = React.useState(`Edit me!`)
    var parsed = psl.parse(window.location.hostname);
    const subdomain = parsed.subdomain
    useEffect(() => {
        if (subdomain === null) {
            // remove this
            // alert("subdomain is null")
            try {
                axiosInstance.get(`/content/${userId}`, { withCredentials: true })
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
        console.log("subdomain is " + parsed.subdomain)

    }, []);
    function iframe() {
        return {
            __html: `
            <div className="container text-justify fontt" style={{ marginTop: "40px", marginBottom: "40px" }}>
                <div className="row">
                    <div className="col-md-10 offset-md-1 text-justify">
                        ${content}
                    </div>
                </div>
            </div>`
        }
    }
    return (
        <>
           {/* <div className="container text-justify fontt" style={{ marginTop: "40px", marginBottom: "40px" }}>
                <div className="row">
                    <div className="col-md-10 offset-md-1 text-justify">
            <div dangerouslySetInnerHTML={iframe()} />
                        
                    </div>
                </div>
            </div> */}

            {hasContent ? (
                <>
                <div className="container card rounded bg-white mt-5 mb-5" style={{marginBottom:"100px"}}>
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