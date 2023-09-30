import React, { useState } from 'react'
// import "../assets/home.css"
import { useEffect } from 'react';
import axiosInstance from '../api/api'
import psl from 'psl';
import 'bootstrap/dist/css/bootstrap.min.css'

function Home() {

  var parsed = psl.parse(window.location.hostname);


  const [content, setContent] = React.useState(false);
  useEffect(() => {
    // console.log("subdomain is " + window.location.hostname.split('.')[0])
    // const subdomain = window.location.hostname.split('.')[0]
    console.log(parsed.sld);
    console.log("subdomain is " + parsed.subdomain)
    // try {
    //   axiosInstance.post(`/init`, { subdomain: subdomain })
    //     .then((response) => {
    //       console.log("init.response =", response);
    //       setContent(response.data.constent);
    //     })
    //     .catch((error) => {

    //       console.log(error);
    //     });
    // }
    // catch (error) {
    //   if (error.response) {
    //     console.log(error.response);
    //     alert(error.response.data.message);
    //   } else if (error.request) {
    //     console.log("network error");
    //   } else {
    //     console.log(error);
    //   }
    // }
  }, []);


  return (
    <>

      {/* <div style={{ height: "500px" }}> */}
       
       
        {/* <div className="content"> */}

          {!content && (
            <>
              {/* <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin magna ex, elementum id convallis eu, elementum id justo. Maecenas dictum sagittis leo, ut ultrices risus mollis vitae. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
                eu lectus felis. Vivamus eget velit erat. Vivamus condimentum augue sed lacus viverra imperdiet. Etiam quis lectus non libero hendrerit porta. In sit amet molestie lacus. Praesent ultricies, lectus eget porta porttitor, sem sapien facilisis arcu,
                eu tincidunt nulla odio ac ipsu.</p>

              <p>Praesent eu arcu convallis, faucibus turpis eu, rutrum nisi. Integer rutrum ipsum at aliquam consequat. In dignissim lorem nibh, nec iaculis est fermentum vitae. Maecenas sodales, nunc eget lacinia volutpat, nibh mi lobortis leo, id varius urna tellus
                ut magna. Sed porttitor nunc et luctus efficitur. Nam sit amet congue nulla. Praesent dapibus erat arcu, at scelerisque arcu faucibus vel. Morbi blandit venenatis elit. Nam feugiat bibendum suscipit. Donec viverra eu lorem eu venenatis. Nullam posuere
                nulla id libero rutrum venenatis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam molestie ac velit vel blandit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis
                egestas.</p> */}
              <section id="hero" className="d-flex align-items-center">
                <div className="container" data-aos="zoom-out" data-aos-delay="100">
                  <h1>Welcome to <span>BizLand</span></h1>
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

              {content && (
                <>

                  <p>{content}</p>
                </>
              )}

              {/* <pre>
            <code>{content}</code>
          </pre> */}

        
        {/* </div> */}
      </>
      )
}

      export default Home