import React, { useEffect, useState } from 'react'
import '../assets/profile.css'
import { useSelector, useDispatch } from 'react-redux'
import { updateUser } from '../store/slices/authSlice'
import axiosInstance from '../api/api'
import { toast } from 'react-hot-toast'
import 'bootstrap/dist/css/bootstrap.min.css'
var AWS = require('aws-sdk');
var Jimp = require('jimp');
function Profile() {
    const [file, setFile] = useState(null);
    const [email, setEmail] = useState()
    const [namee, setName] = useState()
    const [username, setUsername] = useState()
    const [profileImage, setProfileImage] = useState('')

    const [view, setView] = useState('hs')
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
    const userInfo = useSelector((state) => state.auth.userInfo)
    const dispatch = useDispatch()
    const userData = {
        id: userInfo.id,
        email: email,
        name: namee,
        username: username,
        premium_user: userInfo.premium_user
    };
    const handleSubmit = async (e) => {
        e.preventDefault()


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

    var config = {
        accessKeyId: "pPAzlk6rv4x34C6GoJEd",
        secretAccessKey: "aYuVmUYJonn7ESKAcDOop1O2dEca0v3RipG3FUUx",
        endpoint: "readyle.live:9000",
        sslEnabled: false,
        forcePathStyle: true
    };
    AWS.config.update(config);
    const s3Client = new AWS.S3();

    const uploadImage = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('file', file);

        // const response = await s3Client.putObject({ Bucket: 'minio', Key: `docopypaste/profile/${file.name}`, Body: `${file}` })
        // if (!response) {
        //    console.log("error uploading file");
        // }
        try {
            const res = axiosInstance.patch(`user/updateProfileImage/${userData.id}`, formData, { withCredentials: true })
                .then((response) => { console.log(response); })

                .catch((error) => { console.log(error); });
        } catch (error) {
            console.error(error);
        }

        console.log("Successfully uploaded data to myBucket/myKey");
    }

    useEffect(() => {

        console.log("auth from profile", isLoggedIn);
        console.log("userInfo from profile", JSON.stringify(userInfo));
        setView("profile-overview")
        setEmail(userInfo.email)
        setName(userInfo.name)
        setUsername(userInfo.username)

        const fetchProfile = async () => {

            const ne = await s3Client.getSignedUrl('getObject', { Bucket: 'minio', Key: `docopypaste/profile/${userInfo.username}/profile.png`, Expires: 60 })
            console.log(ne);
            setProfileImage(ne)
        }

        fetchProfile().catch((error) => { console.log(error); })
        // try {
        //     const res =  axiosInstance.get(`user/getProfile/${userData.id}`, { withCredentials: true })
        //     .then((response) => {

        //         response.data.signedUrl ? setProfileImage(response.data.signedUrl) : setProfileImage("assets/img/profile-img.jpg")

        //         // if (response.data.content !== null) sethasContent(true); else sethasContent(false);
        //       })
        //       .catch((error) => {
        //         console.log(error);
        //       });
        //     // remove this console.log after testing


        // } catch (error) {
        //         console.error(error);
        // }

    }, [])

    return (
        <>

            <div id='main' className="container" style={{ marginLeft: "auto" }}>
                <section className="section profile">
                    <div className="row">
                        <div className="col-xl-4">

                            <div className="card">
                                <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">

                                    <img src={profileImage} alt="Profile" className="rounded-circle" />
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
                                            <button className="nav-link active" onClick={e => setView("profile-overview")} data-bs-toggle="tab" data-bs-target="#profile-overview">Overview</button>
                                        </li>

                                        <li className="nav-item">
                                            <button className="nav-link" data-bs-toggle="tab" onClick={e => setView("profile-edit")} data-bs-target="#profile-edit">Edit Profile</button>
                                        </li>

                                        <li className="nav-item">
                                            <button className="nav-link" data-bs-toggle="tab" onClick={e => setView("profile-settings")} data-bs-target="#profile-settings">Settings</button>
                                        </li>

                                        <li className="nav-item">
                                            <button className="nav-link" data-bs-toggle="tab" onClick={e => setView("profile-change-password")} data-bs-target="#profile-change-password">Change Password</button>
                                        </li>

                                    </ul>

                                    <div className="tab-content pt-2">
                                        {view === "profile-overview" && (
                                            <div className="tab-pane fade show active profile-overview" id="profile-overview">

                                                <h5 className="card-title">Profile Details</h5>

                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 label ">Full Name</div>
                                                    <div className="col-lg-9 col-md-8">{namee}</div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 label">Username</div>
                                                    <div className="col-lg-9 col-md-8">{username}</div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 label">Email</div>
                                                    <div className="col-lg-9 col-md-8">{email}</div>
                                                </div>

                                            </div>

                                        )}
                                        {view === "profile-edit" && (
                                            <div className="tab-pane show active fade profile-edit pt-3" id="profile-edit">

                                                <form>
                                                    <div className="row mb-3">
                                                        <label for="profileImage" className="col-md-4 col-lg-3 col-form-label">Profile Image</label>
                                                        <div className="col-md-8 col-lg-9">
                                                            <img src={profileImage} alt="Profile" ></img>
                                                            <input name="profileImage" onChange={(e) => setFile(e.target.files[0])} type="file" className="form-control" id="profileImage" />
                                                            <button as='label' onClick={uploadImage} htmlFor='profileImage' className="btn btn-primary">Upload</button>
                                                        </div>
                                                    </div>

                                                    <div className="row mb-3">
                                                        <label for="fullName" className="col-md-4 col-lg-3 col-form-label">Full Name</label>
                                                        <div className="col-md-8 col-lg-9">
                                                            <input name="fullName" type="text" className="form-control" id="fullName" value={namee} />
                                                        </div>
                                                    </div>

                                                    <div className="row mb-3">
                                                        <label for="Email" className="col-md-4 col-lg-3 col-form-label">Email</label>
                                                        <div className="col-md-8 col-lg-9">
                                                            <input name="email" type="email" className="form-control" id="Email" value={email} />
                                                        </div>
                                                    </div>


                                                    <div className="text-center">
                                                        <button type="submit" onSubmit={handleSubmit} className="btn btn-primary">Save Changes</button>
                                                    </div>
                                                </form>
                                            </div>
                                        )}
                                        {view === "profile-settings" && (
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
                                        {view === "profile-change-password" && (
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