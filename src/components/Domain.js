import { useState } from 'react'
import React from 'react'
import axiosInstance from '../api/api'
import { useSelector, useDispatch } from 'react-redux'
import { updateDomain } from '../store/slices/domainSlice'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useEffect } from 'react'
import newEvent from '../api/postHog'
import Popup from 'reactjs-popup';
import toast, { Toaster } from 'react-hot-toast';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
function Domain() {

    const [domain, setDomain] = useState("")

    const userInfo = useSelector((state) => state.auth.userInfo)
    const subdomain = useSelector((state) => state.auth.subdomain)
    const [hasSubdomain, setHasSubdomain] = useState(false)
    const [subdomainObject, setSubdomainObject] = useState([])
    const [open, setOpen] = useState(false);
    const [newSubdomain, setNewSubdomain] = useState("")
    const dispatch = useDispatch()
    const userId = userInfo.id

    const closeModal = () => setOpen(false);


    const handleSubmit = async (e) => {
        e.preventDefault()
        const userData = {
            subdomain: newSubdomain
        };
        setDomain("")
        const res = await axiosInstance.post(`/subdomain/create/${userId}`, userData, { withCredentials: true })
            .then((response) => {
                console.log("subdomainObject", response.data);
                dispatch(updateDomain(newSubdomain))
                toast.success("subdomain created successfully");
                setOpen(false)

            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response);
                    toast.error(error.response.data.message);
                } else if (error.request) {
                    toast.error("network error");
                } else {
                    toast.error(error);
                }
            });
    };

    const checkAvailability = async (e) => {
        const res = await axiosInstance.get(`/subdomain/availability/${userId}`, { withCredentials: true })
            .then((response) => {
                console.log("response", response);
                setOpen(o => !o)
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response);
                    toast.error(error.response.data.message);
                } else if (error.request) {
                    toast.error("network error");
                } else {
                    toast.error(error);
                }
            });
    }

    const handleQR = async (e) => {
        e.preventDefault()
        console.log("handleQR")
    }

    useEffect(() => {
        newEvent("domain", "view domain", "/domain");

        axiosInstance.get(`/subdomain/getsubdomain/${userId}`, {}, { withCredentials: true })
            .then((response) => {
                // console.log("init.response =", response);
                if (response.status === 200) {
                    var subdomain = response
                    console.log("subdomain", subdomain);
                    setHasSubdomain(true)
                    setSubdomainObject(subdomain.data)
                }
                if (response.status === 204) {
                    setHasSubdomain(false)
                }
            })
            .catch((error) => {
                setHasSubdomain(false)
                if (error.response) {
                    console.log(error.response);
                    toast.error(error.response.data.message);
                } else if (error.request) {
                    toast.error("network error");
                } else {
                    toast.error(error);
                }
            });
    }, []);


    return (
        <>
            <div><Toaster /></div>
            {!hasSubdomain &&
                (
                    <>
                        <div style={{ backgroundColor: "white" }} className="container">
                            <form onSubmit={handleSubmit}>
                                <h1>Add subdomain</h1>
                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="subdomaain">subdomain</label>
                                    <input type="text" id="subdomaain" value={domain} onChange={e => setDomain(e.target.value)} className="form-control" />
                                </div>
                                <h5>Your personal domain will be  </h5>
                                <h6><a className='disabled' href={domain}>https://{domain}.cpypst.online</a></h6>
                                <button type="submit" className="btn btn-primary btn-block mb-4">Create Subdoamin</button>
                            </form>
                        </div>
                    </>
                )}
            {hasSubdomain &&
                (
                    <>
                        <div className="container card rounded bg-white mt-5 mb-5" >
                            <h1 className="card-title">
                                Found subdomain
                            </h1>
                            <table className='table' border={1}>
                                <thead>
                                    <tr>
                                        <th scope="col">Subdoamin</th>
                                        <th scope="col">User Name</th>
                                        <th scope="col">Domain</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subdomainObject.map(subdomain => (
                                        <tr key={subdomain._id}>
                                            <th scope="row">1</th>
                                            <td>{subdomain.subdomain}</td>
                                            {/* <td>{subdomain.userId}</td> */}
                                            <td><a href={"https://" + subdomain.subdomain + ".cpypst.online"}>{subdomain.subdomain}.cpypst.online</a></td>
                                            <td><button onClick={handleQR} className="btn btn-primary">Generate QR</button></td>
                                        </tr>

                                    ))}

                                </tbody>
                            </table>
                            <Row >
                                <Col className='mb-2 ali'>
                                    <button onClick={checkAvailability} className="btn btn-primary">Add Subdomain</button>
                                </Col>
                            </Row>
                            <Popup className='card rounded bg-white mt-5 mb-5' open={open} closeOnDocumentClick onClose={closeModal}>
                                <Form onSubmit={handleSubmit}>
                                    <h3 className='card-title'>Create New Subdoamin</h3>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Control type="text" value={newSubdomain} placeholder="New Subdomain" onChange={e => setNewSubdomain(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        <Button type="submit" className="btn btn-primary mb-2">
                                            Create Contact
                                        </Button>
                                    </Form.Group>
                                </Form>
                            </Popup>
                        </div>
                    </>
                )
            }

        </>
    )
}



export default Domain