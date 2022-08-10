import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Paint from "./pages/Paint";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import MyPaints from "./pages/MyPaints";

function App() {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setLogin(!!token);
      setUser(user);
    }
  }, []);

  const isAuthenticate = (token, user) => {
    setLogin(!!token);
    setUser(user);
  };

  return (
    <>
      {!login ? (
        <Routes>
          <Route path="/" element={<UserDashboard />} />
          <Route
            path="/login"
            element={<Login isAuthenticate={isAuthenticate} />}
          />
          <Route
            path="/register"
            element={<Register isAuthenticate={isAuthenticate} />}
          />
        </Routes>
      ) : (
        <Routes>
          <Route
            path="/paint"
            element={
              <Paint
                login={login}
                user={user}
                isAuthenticate={isAuthenticate}
              />
            }
          />
          <Route
            path="myPaints"
            element={
              <MyPaints
                login={login}
                user={user}
                isAuthenticate={isAuthenticate}
              />
            }
          />
        </Routes>
      )}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
