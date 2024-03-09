import React, { useState } from 'react'
import { useEffect } from 'react';
import axiosInstance from '../api/api'
import psl from 'psl';
import 'bootstrap/dist/css/bootstrap.min.css'
import newEvent from '../api/postHog';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Card } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { socket } from "../api/socket";
import { TailSpin } from 'react-loader-spinner'
import { Link } from 'react-router-dom';
import { Container as MuiContainer, Card as MuiCard, Box, Icon, Typography, Button } from "@mui/material";
import LunchDiningRoundedIcon from '@mui/icons-material/LunchDiningRounded';
import useScreenSize from '../hooks/useScreenSize';
import {CardView} from '../common';
function Home() {

  var parsed = psl.parse(window.location.hostname);
  var subdomain = "";
  const [isLoading, setLoading] = useState(true)
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [hascontent, sethasContent] = useState(false);

  useEffect(() => {
    console.log("subdomain is " + parsed.subdomain)
    newEvent("homepage", "homepage", "/homepage");
    subdomain = parsed.subdomain;
    socket.emit('join_room', subdomain);
    socket.on('message', (data) => {
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
              setContent(response.data.content);
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
            <div className="container" data-aos="fade-up">

              <div className="row">
                <div className="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0">
                  <div className="icon-box" data-aos="fade-up" data-aos-delay="100">
                    <div className="icon"><i className="bx bxl-dribbble"></i></div>
                    <h4 className="title"><a href="">Lorem Ipsum</a></h4>
                    <p className="description">Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi</p>
                  </div>
                </div>

                <div className="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0">
                  <div className="icon-box" data-aos="fade-up" data-aos-delay="200">
                    <div className="icon"><i className="bx bx-file"></i></div>
                    <h4 className="title"><a href="">Sed ut perspiciatis</a></h4>
                    <p className="description">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore</p>
                  </div>
                </div>

                <div className="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0">
                  <div className="icon-box" data-aos="fade-up" data-aos-delay="300">
                    <div className="icon"><i className="bx bx-tachometer"></i></div>
                    <h4 className="title"><a href="">Magni Dolores</a></h4>
                    <p className="description">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia</p>
                  </div>
                </div>

                <div className="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0">
                  <div className="icon-box" data-aos="fade-up" data-aos-delay="400">
                    <div className="icon"><i className="bx bx-world"></i></div>
                    <h4 className="title"><a href="">Nemo Enim</a></h4>
                    <p className="description">At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis</p>
                  </div>
                </div>

              </div>

            </div>
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
              </div>
              <div className="row">
                <div className="col-md-24  card-body">
                  <Container style={{ minHeight: "715px", marginTop: "50px" }}>
                    <Row >
                      {content.map((e) => (
                        <Col key={e._id} id={e._id} >
                          <CardView title={e.title} content={e.content} _id={e._id} />
                        </Col>
                      ))}
                    </Row>
                  </Container>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                </div>
              </div>
            </div>
          </div>
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
        </>
      )}
    </>
  )
}

export default Home