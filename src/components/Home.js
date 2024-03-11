import React, { useState } from 'react'
import { useEffect } from 'react';
import axiosInstance from '../api/api'
import psl from 'psl';
import 'bootstrap/dist/css/bootstrap.min.css'
import newEvent from '../api/postHog';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import toast, { Toaster } from 'react-hot-toast';
import { socket } from "../api/socket";
import { Link } from 'react-router-dom';
import { Container as MuiContainer, Card as MuiCard, Box, Icon, Typography, Button } from "@mui/material";
import LunchDiningRoundedIcon from '@mui/icons-material/LunchDiningRounded';
import useScreenSize from '../hooks/useScreenSize';
import { useSelector, useDispatch } from 'react-redux'
import { addContent, updateContent, updateOneContent, removeOneContent } from '../store/slices/contentSlice';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CommonDialog, CardView } from '../common';
import { FaPlus } from "react-icons/fa6";
import Modal from 'react-bootstrap/Modal';
import { MdOpenInFull } from "react-icons/md";
import Card from 'react-bootstrap/Card';
import ReactQuill from 'react-quill';
import { IoRefreshOutline } from "react-icons/io5";
import { addNewUser } from '../store/slices/authSlice';
var subdomain = "";
const modules = {
  toolbar: [
  ],
};
const formats = [];
function Home() {

  var parsed = psl.parse(window.location.hostname);
  const dispatch = useDispatch()
  const isContent = useSelector((state) => state.content.content)

  const userInfo = useSelector((state) => state.auth.userInfo)
  const userId = userInfo.userId
  const username = userInfo.username

  const [isLoading, setLoading] = useState(true)
  const [title, setTitle] = useState("");
  const [hascontent, sethasContent] = useState(false);

  const [newContent, setNewContent] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newIsChecked, setNewIsChecked] = useState(false);

  const [modelId, setModelId] = useState("")
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const openModal = (event) => {
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

    socket.emit("updateContent", ({ room: username, message: contentData }));

    await axiosInstance.patch(`/content/update/public/${modelId}`, contentData) // public route no need to send auth token (with credential)
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

  const viewContent = (id) => {
    console.log("view content called");
    console.log("id =", id);
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
          if (response.data.content !== null && response.data.content.length > 0) 
          {
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
    console.log("subdomain is " + parsed.subdomain)
    newEvent("homepage", "homepage", "/homepage");
    subdomain = parsed.subdomain;
    
    socket.on('updateContent', (data) => {
      console.log("data from server", data);
      // setContent(data.content);
    });
    if (subdomain === null) {
      subdomain = "";
    }
    else {
      
      try {
        axiosInstance.get(`/init/getdata/${subdomain}`)
          .then((response) => {
            console.log("init.response =", response);
            if (response.data.content !== null && response.data.content.length > 0) {
              sethasContent(true);
              socket.emit('join_room', response.data.userId);
              dispatch(addContent(response.data.content));
              dispatch(addNewUser(response.data.userInfo));
              // setContent(response.data.content);
              setTitle(response.data.title);
            } else sethasContent(false);
          })
          .catch((error) => {
            toast.error(error.response.data.message);
            console.log(error);                //here
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
    setLoading(false);
  }, []);

  const [isMobileView] = useScreenSize();

  return (
    <>
      <div><Toaster /></div>
      {!hascontent && (
        <>
          <section id="hero" className="d-flex align-items-center" >
            <div className="container" data-aos="zoom-out" data-aos-delay="100">
              <h1>Welcome to <span>BizLand V4</span></h1>
              <h2>We are team of talented designers making websites with Bootstrap</h2>
              <div className="d-flex">
                <a href="#about" className="btn-get-started scrollto">Get Started</a>
                <a href="https://www.youtube.com/watch?v=jDDaplaOz7Q" className="glightbox btn-watch-video"><i className="bi bi-play-circle"></i><span>Watch Video</span></a>
              </div>
            </div>
          </section>

          <section id="featured-services" className="featured-services">
            <h1>Features</h1>
            <MuiContainer sx={{
              display: "flex", gap: "20px", flex: 1, justifyContent: "space-between", minHeight: "260px",
              padding: isMobileView ? "0 20px !important" : "0 112px !important",
              flexDirection: isMobileView ? "column" : "row"
            }} maxWidth={false}>
              <MuiCard sx={{ flex: 0.25, borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", rowGap: "20px" }}>
                <Box sx={{
                  background: "#3758f9", width: "70px", height: "70px", display: "flex", justifyContent: "center", alignItems: "center",
                  borderRadius: "14px", position: "relative"
                }}>
                  <Box sx={{
                    background: "#3758f9", width: "70px", height: "70px", display: "flex", justifyContent: "center", alignItems: "center",
                    borderRadius: "14px", position: "absolute", transform: "rotate(25deg)", opacity: 0.25, "&:hover": {
                      transform: "rotate(45deg)"
                    }
                  }} />
                  <Icon sx={{ height: "37px", width: "37px", color: "white", zIndex: 2 }}><LunchDiningRoundedIcon /></Icon>
                </Box>
                <Typography fontWeight={600} fontSize={"24px"}>Free and Open-Source</Typography>
                <Typography>Lorem Ipsum is simply dummy text of the printing and industry.</Typography>
                <Typography fontWeight={600}>Learn More</Typography>
              </MuiCard>
              <MuiCard sx={{ flex: 0.25, borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", rowGap: "20px" }}>
                <Box sx={{
                  background: "#3758f9", width: "70px", height: "70px", display: "flex", justifyContent: "center", alignItems: "center",
                  borderRadius: "14px", position: "relative"
                }}>
                  <Box sx={{
                    background: "#3758f9", width: "70px", height: "70px", display: "flex", justifyContent: "center", alignItems: "center",
                    borderRadius: "14px", position: "absolute", transform: "rotate(25deg)", opacity: 0.25, "&:hover": {
                      transform: "rotate(45deg)"
                    }
                  }} />
                  <Icon sx={{ height: "37px", width: "37px", color: "white", zIndex: 2 }}><LunchDiningRoundedIcon /></Icon>
                </Box>
                <Typography fontWeight={600} fontSize={"24px"}>Free and Open-Source</Typography>
                <Typography>Lorem Ipsum is simply dummy text of the printing and industry.</Typography>
                <Typography fontWeight={600}>Learn More</Typography>
              </MuiCard>
              <MuiCard sx={{ flex: 0.25, borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", rowGap: "20px" }}>
                <Box sx={{
                  background: "#3758f9", width: "70px", height: "70px", display: "flex", justifyContent: "center", alignItems: "center",
                  borderRadius: "14px", position: "relative"
                }}>
                  <Box sx={{
                    background: "#3758f9", width: "70px", height: "70px", display: "flex", justifyContent: "center", alignItems: "center",
                    borderRadius: "14px", position: "absolute", transform: "rotate(25deg)", opacity: 0.25, "&:hover": {
                      transform: "rotate(45deg)"
                    }
                  }} />
                  <Icon sx={{ height: "37px", width: "37px", color: "white", zIndex: 2 }}><LunchDiningRoundedIcon /></Icon>
                </Box>
                <Typography fontWeight={600} fontSize={"24px"}>Free and Open-Source</Typography>
                <Typography>Lorem Ipsum is simply dummy text of the printing and industry.</Typography>
                <Typography fontWeight={600}>Learn More</Typography>
              </MuiCard>
              <MuiCard sx={{ flex: 0.25, borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", rowGap: "20px" }}>
                <Box sx={{
                  background: "#3758f9", width: "70px", height: "70px", display: "flex", justifyContent: "center", alignItems: "center",
                  borderRadius: "14px", position: "relative"
                }}>
                  <Box sx={{
                    background: "#3758f9", width: "70px", height: "70px", display: "flex", justifyContent: "center", alignItems: "center",
                    borderRadius: "14px", position: "absolute", transform: "rotate(25deg)", opacity: 0.25, "&:hover": {
                      transform: "rotate(45deg)"
                    }
                  }} />
                  <Icon sx={{ height: "37px", width: "37px", color: "white", zIndex: 2 }}><LunchDiningRoundedIcon /></Icon>
                </Box>
                <Typography fontWeight={600} fontSize={"24px"}>Free and Open-Source</Typography>
                <Typography>Lorem Ipsum is simply dummy text of the printing and industry.</Typography>
                <Typography fontWeight={600}>Learn More</Typography>
              </MuiCard>
            </MuiContainer>
          </section>
          <section>
            <h1>Pricing</h1>
            <MuiContainer sx={{
              display: "flex", gap: "20px", flex: 3, justifyContent: "space-between", minHeight: "416px",
              padding: isMobileView ? "0 20px !important" : "0 112px !important", flexDirection: isMobileView ? "column" : "row"
            }} maxWidth={false}>
              <MuiCard sx={{ flex: 1, borderRadius: "12px", padding: isMobileView ? "40px 32px" : "56px", display: "flex", flexDirection: "column", rowGap: "20px" }}>
                <h5>Starter</h5>
                <Typography><span style={{ fontWeight: 600, fontSize: "18px" }}>$</span> <span style={{ fontWeight: 600, fontSize: "36px" }}>25.00</span> Per Month</Typography>
                <h5>Features</h5>
                <Typography>Up to 1 User</Typography>
                <Typography>All UI components</Typography>
                <Typography>Lifetime access</Typography>
                <Typography>Free updates</Typography>
                <Button variant='contained' sx={{ borderRadius: "8px", backgroundColor: "#3758f9", width: "fit-content", padding: "12px 28px" }}>Purchase Now</Button>
              </MuiCard>
              <MuiCard sx={{ flex: 1, borderRadius: "12px", padding: isMobileView ? "40px 32px" : "56px", display: "flex", flexDirection: "column", rowGap: "20px" }}>
                <h5>Basic</h5>
                <Typography><span style={{ fontWeight: 600, fontSize: "18px" }}>$</span> <span style={{ fontWeight: 600, fontSize: "36px" }}>59.00</span> Per Month</Typography>
                <h5>Features</h5>
                <Typography>Up to 1 User</Typography>
                <Typography>All UI components</Typography>
                <Typography>Lifetime access</Typography>
                <Typography>Free updates</Typography>
                <Button variant='contained' sx={{ borderRadius: "8px", backgroundColor: "#3758f9", width: "fit-content", padding: "12px 28px" }}>Purchase Now</Button>
              </MuiCard>
              <MuiCard sx={{ flex: 1, borderRadius: "12px", padding: isMobileView ? "40px 32px" : "56px", display: "flex", flexDirection: "column", rowGap: "20px" }}>
                <h5>Premium</h5>
                <Typography><span style={{ fontWeight: 600, fontSize: "18px" }}>$</span> <span style={{ fontWeight: 600, fontSize: "36px" }}>99.00</span> Per Month</Typography>
                <h5>Features</h5>
                <Typography>Up to 1 User</Typography>
                <Typography>All UI components</Typography>
                <Typography>Lifetime access</Typography>
                <Typography>Free updates</Typography>
                <Button variant='contained' sx={{ borderRadius: "8px", backgroundColor: "#3758f9", width: "fit-content", padding: "12px 28px" }}>Purchase Now</Button>
              </MuiCard>

            </MuiContainer>
          </section>
        </>
      )}
      {hascontent && (
        <>
          
          <div className="container  card rounded bg-white" style={{ marginBottom: "100px" }}>
            <div className="row">
              <div className="d-flex justify-content-center align-items-center mt-3">
                <h4 className="text-right">User Content</h4>
                <Button className='mt-2' variant='primary' onClick={getinitialData} ><IoRefreshOutline /></Button>

              </div>
              <div className="row">
                <div className="col-md-24  card-body">
                  <Container style={{ minHeight: "715px", marginTop: "50px" }}>
                    <Row >
                      {isContent.map((e) => (
                      <Col  key={e._id} >
                          {/* <CardView title={e.title} editContent={openModal} deleteContent={null} content={e.content} _id={e._id} /> */}
                          <Card key={e._id} id={e._id} style={{ width: '18rem' }}>
                            <Card.Body>
                              <Button className='mt-2' variant='primary' id={e._id} onClick={e => openModal(e.target.id)} ><MdOpenInFull id={e._id} /></Button>
                              <Card.Title>{e.title}</Card.Title>
                              <Card.Text>
                                <ReactQuill
                                  modules={modules}
                                  formats={formats}
                                  style={{ height: "auto", border: "none" }}
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
                  <button className="btn btn-primary mb-3" onClick={e => openModal(e.target.id)} id='createContent'> <FaPlus /> Create New Content </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Home