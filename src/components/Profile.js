import React, { useEffect, useState } from 'react'
import '../assets/profile.css'
import { useSelector, useDispatch } from 'react-redux'
import { updateUser } from '../store/slices/authSlice'
import axiosInstance from '../api/api'
import { toast } from 'react-hot-toast'
import 'bootstrap/dist/css/bootstrap.min.css'


function Profile() {

    const [email, setEmail] = useState()
    const [namee, setName] = useState()
    const [view, setView] = useState('hs')
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
    const userInfo = useSelector((state) => state.auth.userInfo)
    const dispatch = useDispatch()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const userData = {
            id: userInfo.id,
            email: email,
            name: namee,
            premium_user: userInfo.premium_user
        };

        try {
            const res = await axiosInstance.patch(`/users/${userData.id}/update`, userData, { withCredentials: true });
            // remove this console.log after testing

            if (res.status === 200) {
                // alert.success("Login Successful");
                toast.success('Successfully Updated!')
                const userInfo = res.data.userInfo
                console.log("from data", userInfo);
                dispatch(updateUser(userData))
            }
        } catch (error) {
            if (error.response) {
                console.log(error.response);
                toast.error(error.response.data.message)
            } else if (error.request) {
                toast.error('network error')
                console.log("network error");
            } else {
                toast.error(error)
            }
        }
    }
    useEffect(() => {
        console.log("auth from profile", isLoggedIn);
        console.log("userInfo from profile", JSON.stringify(userInfo));
        setView("profile-overview")
        setEmail(userInfo.email)
        setName(userInfo.username)
    }, [])

    return (
        <>
            {/* <div className="container rounded bg-white mt-5 mb-5">
                <div className="row">
                    <div className="col-md-3 border-right">
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5"><img className="rounded-circle mt-5" width="150px" alt="" src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" />
                            <span className="font-weight-bold">{namee}</span><span className="text-black-50">{email}</span><span> </span></div>
                    </div>
                    <form className="col-md-5 border-right" onSubmit={handleSubmit}>
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right">Profile Settings</h4>
                            </div>
                            <div className="row mt-6">
                                <div className="col-md-12">
                                    <label className="labels">Name</label>
                                    <input type="text" className="form-control" placeholder="name" value={namee} onChange={e => setName(e.target.value)} />
                                </div>
                            </div>

                            <div className="row mt-6">

                                <div className="col-md-12">
                                    <label className="labels">Email ID</label>
                                    <input type="text" className="form-control" placeholder="enter email id" value={email} onChange={e => setEmail(e.target.value)} />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <label className="labels">Country</label>
                                    <input type="text" className="form-control" placeholder="country" />
                                </div>
                                <div className="col-md-6">
                                    <label className="labels">State/Region</label>
                                    <input type="text" className="form-control" placeholder="state" />
                                </div>
                            </div>
                            <div className="mt-5 text-center"><button className="btn btn-primary profile-button" type="submit">Update Profile</button></div>
                        </div>
                    </form>

                </div>
            </div> */}
            {/* </div >
    </div > */}
            <div id='main' className="container" style={{ marginLeft: "auto" }}>
                <section className="section profile">
                    <div className="row">
                        <div className="col-xl-4">

                            <div className="card">
                                <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">

                                    <img src="assets/img/profile-img.jpg" alt="Profile" className="rounded-circle" />
                                    <h2>Kevin Anderson</h2>
                                    <h3>Web Designer</h3>
                                    <div className="social-links mt-2">
                                        <a href="#" className="twitter"><i className="bi bi-twitter"></i></a>
                                        <a href="#" className="facebook"><i className="bi bi-facebook"></i></a>
                                        <a href="#" className="instagram"><i className="bi bi-instagram"></i></a>
                                        <a href="#" className="linkedin"><i className="bi bi-linkedin"></i></a>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="col-xl-8">

                            <div className="card">
                                <div className="card-body pt-3">
                                    <ul className="nav nav-tabs nav-tabs-bordered">

                                        <li className="nav-item">
                                            <button className="nav-link active" onClick={e=>setView("profile-overview")} data-bs-toggle="tab" data-bs-target="#profile-overview">Overview</button>
                                        </li>

                                        <li className="nav-item">
                                            <button className="nav-link" data-bs-toggle="tab" onClick={e=>setView("profile-edit")} data-bs-target="#profile-edit">Edit Profile</button>
                                        </li>

                                        <li className="nav-item">
                                            <button className="nav-link" data-bs-toggle="tab" onClick={e=>setView("profile-settings")} data-bs-target="#profile-settings">Settings</button>
                                        </li>

                                        <li className="nav-item">
                                            <button className="nav-link" data-bs-toggle="tab" onClick={e=>setView("profile-change-password")}  data-bs-target="#profile-change-password">Change Password</button>
                                        </li>

                                    </ul>
                                    
                                    <div className="tab-content pt-2">
                                    {view ==="profile-overview" &&(
                                            <div className="tab-pane fade show active profile-overview" id="profile-overview">

                                            <h5 className="card-title">Profile Details</h5>

                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 label ">Full Name</div>
                                                <div className="col-lg-9 col-md-8">Kevin Anderson</div>
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 label">Username</div>
                                                <div className="col-lg-9 col-md-8">Lueilwit</div>
                                            </div>

                                        

                                           

                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 label">Email</div>
                                                <div className="col-lg-9 col-md-8">k.anderson@example.com</div>
                                            </div>

                                        </div>

                                    )}
                                    {view ==="profile-edit" &&(
                                        <div className="tab-pane show active fade profile-edit pt-3" id="profile-edit">

                                            <form>
                                                <div className="row mb-3">
                                                    <label for="profileImage" className="col-md-4 col-lg-3 col-form-label">Profile Image</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <img src="assets/img/profile-img.jpg" alt="Profile" />
                                                        <div className="pt-2">
                                                            <a href="#" className="btn btn-primary btn-sm" title="Upload new profile image">upload</a>
                                                            <a href="#" className="btn btn-danger btn-sm" title="Remove my profile image">Delete</a>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row mb-3">
                                                    <label for="fullName" className="col-md-4 col-lg-3 col-form-label">Full Name</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input name="fullName" type="text" className="form-control" id="fullName" value="Kevin Anderson" />
                                                    </div>
                                                </div>

                                                <div className="row mb-3">
                                                    <label for="Email" className="col-md-4 col-lg-3 col-form-label">Email</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input name="email" type="email" className="form-control" id="Email" value="k.anderson@example.com" />
                                                    </div>
                                                </div>


                                                <div className="text-center">
                                                    <button type="submit" className="btn btn-primary">Save Changes</button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                    {view ==="profile-settings" &&(
                                        <>
                                        <div className="tab-pane show active fade pt-3" id="profile-settings">

                                            <form>

                                                <div className="row mb-3">
                                                    <label for="fullName" className="col-md-4 col-lg-3 col-form-label">Email Notifications</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" id="changesMade" checked />
                                                            <label className="form-check-label" for="changesMade">
                                                                Changes made to your account
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" id="newProducts" checked />
                                                            <label className="form-check-label" for="newProducts">
                                                                Information on new products and services
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" id="proOffers" />
                                                            <label className="form-check-label" for="proOffers">
                                                                Marketing and promo offers
                                                            </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" id="securityNotify" checked disabled />
                                                            <label className="form-check-label" for="securityNotify">
                                                                Security alerts
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-center">
                                                    <button type="submit" className="btn btn-primary">Save Changes</button>
                                                </div>
                                            </form>

                                        </div>
                                        </>
                                    )}
                                    {view ==="profile-change-password" &&(
                                        <div className="tab-pane fade show active pt-3" id="profile-change-password">
                                            <form>

                                                <div className="row mb-3">
                                                    <label for="currentPassword" className="col-md-4 col-lg-3 col-form-label">Current Password</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input name="password" type="password" className="form-control" id="currentPassword" />
                                                    </div>
                                                </div>

                                                <div className="row mb-3">
                                                    <label for="newPassword" className="col-md-4 col-lg-3 col-form-label">New Password</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input name="newpassword" type="password" className="form-control" id="newPassword" />
                                                    </div>
                                                </div>

                                                <div className="row mb-3">
                                                    <label for="renewPassword" className="col-md-4 col-lg-3 col-form-label">Re-enter New Password</label>
                                                    <div className="col-md-8 col-lg-9">
                                                        <input name="renewpassword" type="password" className="form-control" id="renewPassword" />
                                                    </div>
                                                </div>

                                                <div className="text-center">
                                                    <button type="submit" className="btn btn-primary">Change Password</button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default Profile