import { useState } from "react";
import React from "react";
import axiosInstance from "../api/api";
import { useSelector, useDispatch } from "react-redux";
import { initDomain,removeOneDomain, addNewDomain, updateOneDomain } from "../store/slices/domainSlice";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useEffect } from 'react'
import newEvent from '../api/postHog'
import toast, { Toaster } from 'react-hot-toast';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { QRCode } from 'antd';
function Domain() {

    const dispatch = useDispatch();

    const [domain, setDomain] = useState("");
    const [subDomainId, setSubDomainId] = useState("");
    const [url , setUrl] = useState("");
    const userInfo = useSelector((state) => state.auth.userInfo);
    const is_subdomain = useSelector((state) => state.subdomain.subdomain);

    const [hasSubdomain, setHasSubdomain] = useState(false);
    const [subdomainObject, setSubdomainObject] = useState([]);

    const userId = userInfo.id;
    const is_premium = userInfo.is_premium;
    const [newSubdomain, setNewSubdomain] = useState("")

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const [deleteShow, setDeleteShow] = useState(false);
    const handleDeleteClose = () => setDeleteShow(false);

    const [QRShow, setQRShow] = useState(false);
    const handleQRClose = () => setQRShow(false);

    const showDelete = async (e) => {
        e.preventDefault();
        console.log("showDelete");
        setSubDomainId(e.target.id);
        console.log("subDomainId", subDomainId);
        // setSubDomainId("");
        setDeleteShow(true);
    };

    const handleDeleteDomain = async (e) => {
        e.preventDefault();
        const res = await axiosInstance.delete(`/subdomain/delete/${subDomainId}`, { withCredentials: true })
            .then((response) => {
                console.log("response", response);
                toast.success("subdomain deleted successfully");
                setDeleteShow(false)
                dispatch(removeOneDomain({ _id: subDomainId }));
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

    const handleUpdateDomain = async (e) => {
        e.preventDefault();
        const updateData = {
            subdomain: newSubdomain,
            is_premium: is_premium
        };
        const res = await axiosInstance.patch(`/subdomain/update/${subDomainId}`,updateData, { withCredentials: true })
            .then((response) => {
                console.log("response", response);
                toast.success("subdomain updated successfully");
                setDeleteShow(false)
                setHasSubdomain(false);
            }   )
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

    const handleCreateSubdomain = async (e) => {
        e.preventDefault();
        const userData = {
            userId: userId,
            subdomain: newSubdomain,
            active: true,
        };
        setNewSubdomain("");

        const res = await axiosInstance.post(`/subdomain/create/${userId}`, userData, { withCredentials: true })
            .then((response) => {
                console.log("subdomainObject", response.data);
                toast.success("subdomain created successfully");
                dispatch(addNewDomain(response.data.subdomainObject));
                setShow(false)
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
                setShow(o => !o)
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
        e.preventDefault();
        console.log("handleQR");
        setUrl(e.target.id);
        setQRShow(true);
    };

    const getinitialData = async () => {
        console.log("getinitialData called");
        await axiosInstance.get(`/subdomain/getsubdomain/${userId}`, { withCredentials: true })
            .then((response) => {
                // setContent(response.data.content);
                setHasSubdomain(true);
                setSubdomainObject(response.data)
                dispatch(initDomain(response.data));
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
        newEvent("domain", "view domain", "/domain");
        if(is_subdomain.length >=1){ console.log("got domains from state");setHasSubdomain(true)}
        else{ console.log("got data from api call");getinitialData();}
        
    }, []);

    return (
        <>
            <div><Toaster position="bottom-right" reverseOrder={false}/></div>
            {!hasSubdomain &&
                (
                    <>
                        <div style={{ backgroundColor: "white",marginTop:"100px"}} >
                            <form onSubmit={handleCreateSubdomain}>
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
                        <div className="container card rounded bg-white  mb-5" style={{marginTop:"100px"}}>
                            <h1 className="card-title">
                                Found subdomain
                            </h1>
                            <table className='table' border={1}>
                                <thead>
                                    <tr>
                                        <th scope="col">Subdoamin</th>
                                        <th scope="col">User Name</th>
                                        <th scope="col">Domain</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {is_subdomain.map(subdomain => (
                                        <tr key={subdomain._id}>
                                            <th scope="row">1</th>
                                            <td>{subdomain.subdomain}</td>
                                            {/* <td>{subdomain.userId}</td> */}
                                            <td><a href={"https://" + subdomain.subdomain + ".cpypst.online"} target="_blank">{subdomain.subdomain}.cpypst.online</a></td>
                                            <td><Button onClick={handleQR} variant="primary" id={"https://" + subdomain.subdomain + ".cpypst.online"} >Generate QR</Button></td>
                                            <td><Button variant="danger" onClick={showDelete} id={subdomain._id} >Delete</Button></td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                            <Row >
                                <Col className='mb-2 ali'>
                                    <button onClick={checkAvailability} className="btn btn-primary">Add Subdomain</button>
                                </Col>
                            </Row>
                            {/* create domain model */}
                            <Modal show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Create New Subdomain</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Title</Form.Label>
                                            {/* <input type="text" placeholder="Title" value={newTitle} autoFocus /> */}
                                            <Form.Control type="text" value={newSubdomain} placeholder="New Subdomain" onChange={e => setNewSubdomain(e.target.value)} autoFocus />
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                                    <Button variant="primary" onClick={handleCreateSubdomain}>Create New Subdoamin</Button>
                                </Modal.Footer>
                            </Modal>
                            {/* Delete Domain model */}
                            <Modal show={deleteShow} backdrop="static" aria-labelledby="contained-modal-title-vcenter" centered onHide={handleDeleteClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Delete Domain</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>To confirm deletion, Click on Delete Domain.</Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleDeleteClose}>
                                        Cancel
                                    </Button>
                                    <Button variant="danger" onClick={handleDeleteDomain}>
                                        Delete Domain
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                            {/* QR model */}
                            <Modal size="sm" show={QRShow} backdrop="static" aria-labelledby="contained-modal-title-vcenter" centered onHide={handleQRClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>QR Coce</Modal.Title>
                                </Modal.Header>
                                <Modal.Body className="align-items-center d-flex justify-content-center">
                                    <QRCode
                                        errorLevel="H"
                                        value={url}
                                        icon="https://res.cloudinary.com/dya4asvgq/image/upload/v1710122415/vur4fbp2eocbuckwtdo8.png"
                                    />
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="primary" onClick={handleQRClose}>
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    </>
                )}
        </>
    )
}

export default Domain
