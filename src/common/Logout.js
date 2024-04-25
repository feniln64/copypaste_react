import { useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import reactCookie from "react-cookies";
import { useEffect } from "react";
import { removeUser } from "../store/slices/authSlice";
import { removeContent } from "../store/slices/contentSlice";
import { removeDomain } from "../store/slices/domainSlice";
import { removeSharedWithMe } from '../store/slices/sharedWithMeSlice'
import { removeSharedBy } from '../store/slices/sharedBySlice'


const Logout = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logout = () => {
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userInfo");
        dispatch(removeUser());
        dispatch(removeContent());
        dispatch(removeDomain());
        dispatch(removeSharedWithMe());
        dispatch(removeSharedBy());
        navigate("/login");
    };

    useEffect(() => {
        const refreshToken = reactCookie.load("refreshToken");
        console.log("logout function called");
        if (refreshToken === 'undefined') {
            logout();
        }
    }, []);
    
    return <></>;
}

export default Logout;