import { Link, useLocation } from "react-router-dom";

import { toast } from "react-toastify";

const Layout = ({ login, user, isAuthenticate, children }) => {
  const location = useLocation();
  return (
    <div className=" bg-slate-300 h-screen">
      <header className=" bg-blue-600 font-bold">
        <nav className=" flex p-2 text-white items-center">
          <span>LOGO</span>
          {!login ? (
            <>
              <Link
                to="/login"
                className=" ml-auto border-purple-500 text-center text-white"
              >
                Login
              </Link>
              <Link
                className=" ml-4 rounded-sm bg-orange-500 py-1 px-2"
                to="/register"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="ml-auto flex items-center gap-1">
              <span
                className=" ml-auto border-purple-500 text-center text-white"
                style={{ textTransform: "capitalize" }}
              >
                {user?.email?.split("@")[0]}
              </span>
              {location.pathname === "/paint" && (
                <Link
                  to="/myPaints"
                  className=" ml-4 rounded-sm border-2 border-orange-500 py-1 px-2"
                >
                  My Paints
                </Link>
              )}
              {location.pathname === "/myPaints" && (
                <Link
                  to="/paint"
                  className=" ml-4 rounded-sm border-2 border-orange-500 py-1 px-2"
                >
                  Draw
                </Link>
              )}
              <Link
                className=" ml-4 rounded-sm bg-orange-500 py-1 px-2"
                to="/"
                onClick={() => {
                  localStorage.clear();
                  isAuthenticate(false, null);
                  toast.success("Comeback Soon!");
                }}
              >
                Logout
              </Link>
            </div>
          )}
        </nav>
      </header>

      <main className=" flex flex-col items-center justify-center h-5/6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
