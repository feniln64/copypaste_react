import './App.css';
import { Route, Routes } from "react-router-dom";
import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import { useEffect } from 'react';
import Profile from './components/Profile';
import Error from './templates/Error';
import Domain from './components/Domain';
import ViewContent from './components/ViewContent';
import Content from './components/EditContent';
import sendPageView from './api/googleGA';
import { ref, set,onValue } from "firebase/database";

import {db} from './api/firebase';
function App() {
  useEffect(() => {
    set(ref(db, 'users/'), {
      online: true,
      count: 1
    });
  const starCountRef = ref(db, 'users' );    
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    console.log(data["online"]);
  });
  sendPageView(window.location.pathname + window.location.search, "App page");
  }, []);
  return (
    <Routes>
        <Route path="/" element={<Layout />} >

        <Route index element={<Home/>} />
        <Route path={"/login"} element={<Login/>} />
        <Route path={"/register"} element={<Register/>} />
        <Route path={"/profile"} element={<Profile/>} />
        <Route path={"/add-domain"} element={<Domain/>} />
        <Route path={"/content"} element={<ViewContent/>} />
        <Route path={"/create-content"} element={<Content/>} />
        <Route path={"*"} element={<Error/>} />

        </Route>
      </Routes>
  );
}

export default App;
