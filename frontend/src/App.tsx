import "./styles.css";
import Login from "./components/auth/login";
import Signup from "./components/auth/signup";
import Homepage from "./components/home/homepage";
import {Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/authContext";

function App() {

  const { isLoggedIn } = useAuth();

  return (
    <div className="flex justify-center items-center h-screen">
      <Routes>
          <Route path="/login" element={isLoggedIn ? <></> : <Login/>}/>
          <Route path="/signup" element={ isLoggedIn ? <></> : <Signup/>}/>
          <Route path="/" element={isLoggedIn ? <Homepage/> : <Login/>}/>
      </Routes>
    </div>
  )
}

export default App
