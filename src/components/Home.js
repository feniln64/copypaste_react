import React, { useState } from 'react'
import { useEffect } from 'react';
import axiosInstance from '../api/api'
import psl from 'psl';
import data from '../assets/data.json';
import 'bootstrap/dist/css/bootstrap.min.css'
import newEvent from '../api/postHog';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import toast, { Toaster } from 'react-hot-toast';
import { socket } from "../api/socket";
import { Container as MuiContainer, Button } from "@mui/material";
import LunchDiningRoundedIcon from '@mui/icons-material/LunchDiningRounded';
import { GridViewRounded, LayersRounded, DashboardRounded } from '@mui/icons-material';
import useScreenSize from '../hooks/useScreenSize';
import { useSelector, useDispatch } from 'react-redux'
import { addContent, updateOneContent, addNewContent } from '../store/slices/contentSlice';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CommonDialog, FeaturesCard, PricingCard } from '../common';
import { FaPlus } from "react-icons/fa6";
import '../assets/content.css';
import Card from 'react-bootstrap/Card';
import ReactQuill from 'react-quill';
import { IoRefreshOutline } from "react-icons/io5";
import { addNewUser } from '../store/slices/authSlice';
var subdomain = "";

const featureData = [
  {
    icon: <LunchDiningRoundedIcon />,
    title: "Free and Open-Source"
  },
  {
    icon: <DashboardRounded />,
    title: "Multipurpose Template"
  },
  {
    icon: <LayersRounded />,
    title: "High-quality Design"
  },
  {
    icon: <GridViewRounded />,
    title: "All Essential Elements"
  },
];

const pricings = [
  { price: 25 },
  { price: 59 },
  { price: 99 },
];

function Home() {

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

  const [isMobileView] = useScreenSize();

  return (
    <>
      <div><Toaster /></div>
      {!hascontent && (
        <>
          <section class="section section-header text-dark " style={{ backgroundColor: 'white' }}>
            <div class="container mb-3">
              <div class="row justify-content-center" style={{ marginBottom: "100px" }} >
                <div class="col-12 col-md-10 text-center ">
                  <h1 class="display-2 font-weight-bolder ">
                    Simple & Reliable.
                  </h1>
                  <p class="lead  mb-lg-5">CPYPST helps you share important data securly <br />with custom domain with private and public access.</p>
                </div>
                <div class="col-12 col-md-10  justify-content-center">
                  <img class="d-none d-md-inline-block" src="./assets/img/scene.svg" alt="Mobile App Mockup" />
                </div>
              </div>
            </div>
            <div class="container mb-5">
              <div class="row mb-5">
                {data.features.map((e, i) => (
                  <div key={i} class="col-12 col-md-6 col-lg-4 mb-4 mb-lg-0">
                    <div class="card border-0 bg-white text-center p-1">
                      <div class="card-header bg-white border-0 pb-0">
                        <div class="icon icon-lg icon-primary mb-4">
                          <span class={`fas ${e.icon}`}></span>
                        </div>
                        <h2 class="h3 text-dark m-0">{e.title}</h2>
                      </div>
                      <div class="card-body">
                        <p>
                          {e.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div class="container " >
              <div class="row justify-content-center mb-5 mb-lg-7">
                <div class="col-12 col-lg-8 text-center">
                  <h2 class="h1 mb-4">Better in every way</h2>
                  <p class="lead">Self-Service Analytics or ad hoc reporting gives users the ability to develop rapid reports, empowering users to analyze their data.</p>
                </div>
              </div>
              <div class="row row-grid align-items-center mb-5 mb-lg-7" >
                <div class="col-12 col-lg-5" style={{ marginBottom: "100px" }}>
                  <h2 class="mb-4">A thoughtful way to pay</h2>
                  <p>Simpler App remembers your important details, so you can fill carts, not forms. And everything is encrypted so you can speed safely through checkout.</p>
                  <p>Now, you can offset the carbon emissions produced by your deliveries—for free. All you have to do is check out with Shop Pay, one of the first carbon-neutral way to pay.</p>

                </div>
                <div class="col-12 col-lg-6 ml-lg-auto">
                  <img src="./assets/img/scene-3.svg" class="w-100" alt="" />
                </div>
              </div>
              <div class="row row-grid align-items-center mb-5 mb-lg-7">
                <div class="col-12 col-lg-5 order-lg-2">
                  <h2 class="mb-4">Get it. Don't sweat it.</h2>
                  <p>We track your desktop and mobile keyword rankings from any location and plot your full ranking history on a handy graph.</p>
                  <p>You can set up automated ranking reports to be sent to your email address, so you’ll never forget to check your ranking progress.</p>

                </div>
                <div class="col-12 col-lg-6 mr-lg-auto">
                  <img src="./assets/img/scene-2.svg" class="w-100" alt="" />
                </div>
              </div>
              <div class="row">
                {data.about.map((e, i) => (
                  <div key={i} class="col-12 col-md-6 col-lg-4 mb-4">
                    <div class="card border-light p-4">
                      <div class="card-body">
                        <h2 class="display-2 mb-2">{e.title}</h2>
                        <span>{e.description}</span>
                      </div>
                    </div>
                  </div>))}
              </div>
            </div>
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
                  <Container style={{ minHeight: "715px", marginTop: "50px", alignItems: "center" }}>
                    <Row style={{ display: "flex", alignItems: "center" }} className='d-flex justify-content-center' >
                      {isContent.map((e) => (
                        <Col key={e._id} >
                          {/* <CardView title={e.title} editContent={openModal} deleteContent={null} content={e.content} _id={e._id} /> */}
                          <Card key={e._id} id={e._id} style={{ width: '18rem' }}>
                            <Card.Body>
                              <Card.Title > <button id={e._id} onClick={e => openModal(e.target.id)} style={{ fontWeight: "bold", textTransform: "", border: "none", backgroundColor: "white" }} >{e.title}</button></Card.Title>
                              <Card.Text>
                                <ReactQuill
                                  modules={{ toolbar: false }}
                                  formats={[]}
                                  style={{ height: "auto", border: "none" }}
                                  readOnly={true}
                                  value={e.content.slice(0, 20)}
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