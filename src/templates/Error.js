import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link } from 'react-router-dom'

function Error() {

  return (
    <>
      <div className="container">

        <section className="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
          <Link className="btn btn-primary" to="/">Back to home</Link>
          {/* <a href="https://storyset.com/web">Web illustrations by Storyset</a> */}
          <img style={{height:"700px"}} src="assets/img/error-404.svg" className="img-fluid py-5" alt="Page Not Found" />
        </section>

      </div>

    </>
  )
}

export default Error