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
      setContent(data.content);
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
          </section>
        </>
      )}
      {hascontent && (
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
      )}1
    </>
  )
}

export default Home