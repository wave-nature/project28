import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const UserDashboard = () => {
  return (
    <Layout>
      <h2 className=" text-5xl font-bold">Welcome to Project28</h2>
      <div className="mt-5    ">
        <Link
          className=" ml-auto border-orange-500 border-2 px-4 py-1 text-center rounded-sm"
          to="/login"
        >
          Login
        </Link>
        <Link
          className=" ml-4 rounded-sm bg-orange-500 py-1 px-3"
          to="/register"
        >
          Register
        </Link>
      </div>
    </Layout>
  );
};

export default UserDashboard;
