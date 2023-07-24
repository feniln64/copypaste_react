import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axiosInstance from '../api/api';
import 'bootstrap/dist/css/bootstrap.min.css'

const Register = () => {
    const message = "";
    const navigate = useNavigate();

    const [userName, setuserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault()
        const userData = {
            name: userName,
            email: email,
            password: password
        };
        setEmail("");
        setPassword("");
        setuserName("");
        try {
            const res = await axiosInstance.post("/auth/signup", userData, { withCredentials: true });
            // remove this console.log after testing
            console.log(res);
            if (res.status === 201) {

                toast.success('Registered Successfully')
                navigate("/login");
            }
        } catch (error) {
            if (error.response) {
                console.log(error.response);
                toast.error(error.response.data.message)
            } else if (error.request) {
                toast.error('network error')
            } else {
                toast.error(error)
            }
        }

    };

    return (
        <>
            {/* <div><Toaster position="bottom-left"
            reverseOrder={false}/></div>
            <div className='container'>
            <div className='bold-line'></div>
            <div className='container'>
                <div className='window'>
                    <div className='overlay'></div>
                    <form className='content' onSubmit={handleSubmit}>
                        <div className='welcome'>Hello There!</div>
                        <div className='subtitle'>We're almost done. Before using our services you need to create an account.</div>
                        <div className='input-fields' >
                            <input type='text' placeholder='Name' className='input-line full-width' value={Name} onChange={e=>setName(e.target.value)} required></input>
                            <input type='email' placeholder='Email' className='input-line full-width' value={email} onChange={e=>setEmail(e.target.value)} required></input>
                            <input type='password' placeholder='Password' className='input-line full-width' value={password} onChange={e=>setPassword(e.target.value)} required></input>
                        </div>
                        <div className='spacing'>or continue with <span className='highlight'>Facebook</span></div>
                        <div><button type='submit' className='ghost-round full-width'>Create Account</button></div>
                    </form>
                {message}
                </div>
            </div>
        </div> */}
            <div className="container" style={{ marginTop: "60px" }}>

                <section className="section register  d-flex flex-column align-items-center justify-content-center py-4">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

                                {/* <div className="d-flex justify-content-center py-4">
          <a href="index.html" className="logo d-flex align-items-center w-auto">
            <img src="assets/img/logo.png" alt=""/>
            <span className="d-none d-lg-block">NiceAdmin</span>
          </a>
        </div> */}

                                <div className="card mb-3">

                                    <div className="card-body">

                                        <div className="pt-4 pb-2">
                                            <h5 className="card-title text-center pb-0 fs-4">Create an Account</h5>
                                            <p className="text-center small">Enter your personal details to create account</p>
                                        </div>

                                        <form className="row g-3 needs-validation" onSubmit={handleSubmit}>
                                            <div className="col-12">
                                                <label htmlFor="yourName" className="form-label">Your Name</label>
                                                <input type="text" name="name" className="form-control" id="yourName" required />
                                                <div className="invalid-feedback">Please, enter your name!</div>
                                            </div>

                                            <div className="col-12">
                                                <label htmlFor="yourEmail" className="form-label">Your Email</label>
                                                <input type="email" name="email" className="form-control" id="yourEmail" value={email} onChange={e => setEmail(e.target.value)} required />
                                                <div className="invalid-feedback">Please enter a valid Email adddress!</div>
                                            </div>

                                            <div className="col-12">
                                                <label htmlFor="yourUsername" className="form-label">Username</label>
                                                <div className="input-group has-validation">
                                                    <span className="input-group-text" id="inputGroupPrepend">@</span>
                                                    <input type="text" name="username" className="form-control" value={userName} onChange={e => setuserName(e.target.value)} id="yourUsername" required />
                                                    <div className="invalid-feedback">Please choose a username.</div>
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <label htmlFor="yourPassword" className="form-label">Password</label>
                                                <input type="password" name="password" className="form-control" id="yourPassword" required />
                                                <div className="invalid-feedback">Please enter your password!</div>
                                            </div>

                                            <div className="col-12">
                                                <div className="form-check">
                                                    <input className="form-check-input" name="terms" type="checkbox" value="" id="acceptTerms" required />
                                                    <label className="form-check-label" htmlFor="acceptTerms">I agree and accept the <a href="#">terms and conditions</a></label>
                                                    <div className="invalid-feedback">You must agree before submitting.</div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <button className="btn btn-primary w-100" type="submit">Create Account</button>
                                            </div>
                                            <div className="col-12">
                                                <p className="small mb-0">Already have an account? <a href="pages-login.html">Log in</a></p>
                                            </div>
                                        </form>

                                    </div>
                                </div>

                                {/* <div className="credits">
          Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
        </div> */}

                            </div>
                        </div>
                    </div>

                </section>

            </div>
        </>

    )
}

export default Register