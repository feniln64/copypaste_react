import React, { useState } from 'react'
import { useEffect } from 'react';
import axiosInstance from '../api/api'
import psl from 'psl';
import 'bootstrap/dist/css/bootstrap.min.css'
import newEvent from '../api/postHog';
import Form from 'react-bootstrap/Form';
import toast, { Toaster } from 'react-hot-toast';
import { socket } from "../api/socket";
import { Box, Typography, Grid, Button as MUIButton } from "@mui/material";
import useScreenSize from '../hooks/useScreenSize';
import { useSelector, useDispatch } from 'react-redux'
import { addContent, updateOneContent } from '../store/slices/contentSlice';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CardView, CommonDialog } from '../common';
import { FaPlus } from "react-icons/fa6";
import '../assets/content.css';
import { addNewUser } from '../store/slices/authSlice';
import { useNavigate } from "react-router-dom";
import NoDomain from '../common/NoDomain';
var subdomain = "";

function Home() {
  const navigate = useNavigate();
  


  var parsed = psl.parse(window.location.hostname);
  const dispatch = useDispatch()
  const isContent = useSelector((state) => state.content.content)

  const userInfo = useSelector((state) => state.auth.userInfo)
  const userId = userInfo.userId
  const username = userInfo.username

  const [hascontent, sethasContent] = useState(false);

  const [newContent, setNewContent] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newIsChecked, setNewIsChecked] = useState(false);

  const [modelId, setModelId] = useState("")
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [editable, setEditable] = useState(false);

  const openModal = (event, editable = true) => {
    console.log("event =", event);
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
    setEditable(editable)
  };

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

    await axiosInstance.patch(`/content/update/public/${modelId}`, contentData) // public route no need to send auth token (with credential)
      .then((response) => {
        if (response.status === 200) {
          dispatch(updateOneContent(contentData))
          // setContent(isContent)
          handleClose()
          toast.success("data updated Successfully");
          socket.emit('updatecontent', { room: username, message: contentData });
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
      subdomain: subdomain,
      content: newContent,
      is_protected: false,
      title: newTitle,
      is_shared: false
    };
    console.log("contentData =", contentData);
    setNewTitle("")
    setNewContent("")

    socket.emit("newContent", ({ room: username, message: contentData }));

    await axiosInstance.post(`/content/create/public/${userId}`, contentData) // public route no need to send auth token (with credential)
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
    await axiosInstance.get(`/init/getdata/${subdomain}`) // public route no need to send auth token (with credential)
      .then((response) => {
        if (response.data.content !== null && response.data.content.length > 0) {
          console.log("response.data.content =", response.data.content);
          sethasContent(true)
          dispatch(addContent(response.data.content))
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
  }

  useEffect(() => {
    newEvent("homepage", "homepage", "/homepage");
    subdomain = parsed.subdomain;
    console.log("subdomain =", subdomain);
    
    if (subdomain === null) {
      subdomain = "";
    }
    else {
      axiosInstance.get(`/init/getdata/${subdomain}`)
        .then((response) => {
          console.log("init.response =", response);
          if (response.data.content !== null && response.data.content.length > 0) {
            sethasContent(true);
            socket.emit('join_room', response.data.userInfo.username);
            dispatch(addContent(response.data.content));
            dispatch(addNewUser(response.data.userInfo));
          } else sethasContent(false);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
          console.log(error);                //here
        });
    }
    socket.on('updatecontent', (data) => {
      console.log("data from server", data);
      // setContent(data.content);
    });

    socket.on('newcontent', (data) => {
      getinitialData();
    });

    socket.on('deletecontent', (data) => {
      getinitialData();
    });

  }, []);

  const [isMobileView,isTabletView] = useScreenSize();

  return (
    <>
      <Toaster position='bottom-right' reverseOrder={false} />

      {!hascontent && (
        <>
          <NoDomain />
        </>
      )}
      {hascontent && (
        <>
          
                <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    padding: isMobileView ? "20px !important" : "40px !important",
                    background: "#fff",
                    gap: "30px",
                    borderRadius: "8px",
                    flex: 1,
                    margin: isMobileView ? "25px 10px" : "100px 105px",
                    boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px",
                }}
            >
                <Typography variant='h5' fontWeight={"bold"} textAlign={"center"}>User Content</Typography>
                <Grid container>
                    {isContent.map((e) => (
                        <Grid key={e._id} item xs={12} md={6} lg={4}
                            sx={{
                                padding: "20px",
                                display: isTabletView ? 'flex' : 'block',
                                justifyContent: isTabletView ? 'center' : 'flex-start',
                                // border: '1px solid red'
                            }}
                        >
                            <Box sx={{ width: isMobileView ? "auto" : "18rem", borderRadius: "8px" }}>
                                {/* {if (e.content.length > 10) e.content = e.content.slice(0, 10) + "..."} */}
                                <CardView
                                    title={e.title}
                                    editContent={openModal}
                                    content={e.content.slice(0, 20)+"..." }
                                    _id={e._id}
                                    shouldDelete={false}
                                    shouldShare={false}
                                    shouldEdit
                                />
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
                  {/* <button className="btn btn-primary mb-3" onClick={e => openModal(e.target.id)} id='createContent'> <FaPlus /> Create New Content </button> */}
                </div>
        </>
      )}
    </>
  )
}

export default Home