import './App.css';
import { Route, Routes } from "react-router-dom";
import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Error from './templates/Error';
import Domain from './components/Domain';
import ViewContent from './components/ViewContent';
import Content from './components/EditContent';
import Shared from './components/Shared';
function App() {
  console.log("process.env.NODE_ENV", process.env.NODE_ENV);
  return (
    <Routes>
        <Route path="/" element={<Layout />} >

        <Route index element={<Home/>} />
        <Route path={"/login"} element={<Login/>} />
        <Route path={"/register"} element={<Register/>} />
        <Route path={"/profile"} element={<Profile/>} />
        <Route path={"/add-domain"} element={<Domain/>} />
        <Route path={"/shared"} element={<Shared/>} />
        <Route path={"/content"} element={<ViewContent/>} />
        <Route path={"/create-content"} element={<Content/>} />
        <Route path={"*"} element={<Error/>} />

        </Route>
      </Routes>
  );
}

export default App;
