import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import Layout from "../components/Layout";

const Login = ({ isAuthenticate }) => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setState({ ...state, [name]: value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBbaXBs_GAzYZkYBpAoNP_TvzwhJI9HV5E",
        {
          email: state.email,
          password: state.password,
          returnSecureToken: true,
        }
      );

      setLoading(false);

      const token = response.data.idToken;
      const email = response.data.email;

      isAuthenticate(token, { email });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ email }));
      toast.success("Successfully Loggedin!");
      navigate("../paint", { replace: true });
    } catch (error) {
      toast.error("Either email or password is incorrect");
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="bg-white p-10 rounded  tex-lg">
        <form onSubmit={loginHandler}>
          <div className="flex gap-4 justify-between my-2">
            <label>Email</label>
            <input
              type="email"
              name="email"
              onChange={onChange}
              value={state.email}
              placeholder="enter email"
              className=" border-2 border-blue-800 p-1 rounded"
            />
          </div>
          <div className="flex gap-4 justify-between my-2">
            <label>Password</label>
            <input
              type="password"
              name="password"
              onChange={onChange}
              value={state.password}
              placeholder="enter password"
              className=" border-2 border-blue-800 p-1 rounded"
            />
          </div>
          <button className="  bg-orange-500 py-1 px-2 w-full mt-2 text-white font-bold rounded">
            {!loading ? "Login" : "Logging ..."}
          </button>
        </form>
        <div className="flex justify-between mt-5">
          <p>New User?</p>
          <Link
            className="rounded-sm border-2 border-orange-500 py-1 px-2"
            to="/register"
          >
            Register
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
