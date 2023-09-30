import { useState } from 'react'
import React from 'react'
import axiosInstance from '../api/api'
import { useSelector, useDispatch } from 'react-redux'
import { updateDomain } from '../store/slices/domainSlice'
import { toast } from 'react-hot-toast'
import { useEffect } from 'react'
function Domain() {

    const [domain, setDomain] = useState("")
    console.log(domain)
    const userInfo = useSelector((state) => state.auth.userInfo)
    const subdomain = useSelector((state) => state.auth.subdomain)
    const [hasSubdomain, setHasSubdomain] = useState(false)
    const [subdomainObject, setSubdomainObject] = useState([])
    const dispatch = useDispatch()
    const userData = {
        userId: userInfo.id,
        subdomain: domain,
        active: true
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        setDomain("")

        try {
            const res = await axiosInstance.post(`/subdomain/create/${userInfo.id}`, userData, { withCredentials: true });
            // remove this console.log after testing
            if (res.status === 200) {
                const response = res.data.subdomainObject
                console.log("subdomainObject", response);
                dispatch(updateDomain(domain))
            }
        } catch (error) {
            if (error.response) {
                console.log(error.response.data.message);
                toast.error(error.response.data.message)
            } else if (error.request) {
                console.log("network error");
            } else {
                console.log(error)
            }
        }
    };

    const handleQR = async (e) => {
        e.preventDefault()
        console.log("handleQR")
    }
    useEffect(() => {
        try {
            axiosInstance.get(`/subdomain/getsubdomain/${userData.userId}`, {}, { withCredentials: true })
                .then((response) => {
                    // console.log("init.response =", response);
                    if (response.status === 200) {
                        const subdomain = response.data
                        console.log("subdomain", subdomain);
                        setHasSubdomain(true)
                        setSubdomainObject(subdomain)
                    }
                    if (response.status === 204) {
                        setHasSubdomain(false)
                        
                    }
                })
                .catch((error) => {
                    setHasSubdomain(false)
                    console.log(error);
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
    }, []);
    return (
        <>
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
                                <h6><a className='disabled' href={domain}>https://{domain}.docopypaste.live</a></h6>



                                <button type="submit" className="btn btn-primary btn-block mb-4">Create Subdoamin</button>
                            </form>
                        </div>
                    </>
                )}
            {hasSubdomain &&
                (
                    <>
                        <div  className="container card card rounded bg-white mt-5 mb-5" >
                            <h1 className="card-title">
                                Found subdomain
                            </h1>
                            <table className='table' border={1}>
                            <thead>
                                <tr>
                                    <th scope="col">Subdoamin</th>
                                    <th scope="col">UserId</th>
                                    <th scope="col">Domain</th>
                                    <th scope="col">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {subdomainObject.map(subdomain => (
                                    <tr key={subdomain.id}>
                                        <th scope="row">1</th>
                                        <td>{subdomain.subdomain}</td>
                                        {/* <td>{subdomain.userId}</td> */}
                                        <td><a href={"https://"+subdomain.subdomain+".readyle.live"}>{subdomain.subdomain}.readyle.live</a></td>
                                        <td><button onClick={handleQR} className="btn btn-primary">Generate QR</button></td>
                                    </tr>
                                   
                                ))}
                                 
                                </tbody>
                            </table>
                        </div>
                    </>
                )
            }

        </>
    )
}



export default Domain