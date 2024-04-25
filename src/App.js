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
import Forgotpassword from './components/Forgotpassword';
import Resetpassword from './components/Resetpassword';
function App() {
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
        <Route path={"/forgot-password"} element={<Forgotpassword/> } />
        <Route path={"/reset-password/:token"} element={<Resetpassword/> } />
        <Route path={"*"} element={<Error/>} />

        </Route>
      </Routes>
  );
}

export default App;
