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

      <div style={{ height: "500px" }}>
        <div className="blue-bg"></div>
        <div className="white-bg shadow"></div>
        <div className="content">
          <h1>Slanted & Enchanted</h1>

          {!content && (
          <>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin magna ex, elementum id convallis eu, elementum id justo. Maecenas dictum sagittis leo, ut ultrices risus mollis vitae. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
                eu lectus felis. Vivamus eget velit erat. Vivamus condimentum augue sed lacus viverra imperdiet. Etiam quis lectus non libero hendrerit porta. In sit amet molestie lacus. Praesent ultricies, lectus eget porta porttitor, sem sapien facilisis arcu,
                eu tincidunt nulla odio ac ipsu.</p>

              <p>Praesent eu arcu convallis, faucibus turpis eu, rutrum nisi. Integer rutrum ipsum at aliquam consequat. In dignissim lorem nibh, nec iaculis est fermentum vitae. Maecenas sodales, nunc eget lacinia volutpat, nibh mi lobortis leo, id varius urna tellus
                ut magna. Sed porttitor nunc et luctus efficitur. Nam sit amet congue nulla. Praesent dapibus erat arcu, at scelerisque arcu faucibus vel. Morbi blandit venenatis elit. Nam feugiat bibendum suscipit. Donec viverra eu lorem eu venenatis. Nullam posuere
                nulla id libero rutrum venenatis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam molestie ac velit vel blandit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis
                egestas.</p>
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

        </div>
      </div>
    </>
  )
}

export default Home