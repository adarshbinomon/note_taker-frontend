import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface NavbarProps {
  userInfo: any;
}

const Navbar: React.FC<NavbarProps> = ({ userInfo }) => {
  const location = useLocation();
  console.log(location);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Notes
        </Link>
      </div>
      {userInfo ? (
        <div>
          <p className="font-semibold px-4 text-l">{userInfo.name}</p>
          <button className="btn bg-red-700 text-white" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : location.pathname === "/signup" ? (
        <Link to={"/login"}>
          <button className="btn bg-slate-600 text-white hover:text-black">
            Login
          </button>
        </Link>
      ) : (
        <Link to={"/signup"}>
          <button className="btn bg-slate-600 text-white hover:text-black">
            Signup
          </button>
        </Link>
      )}
    </div>
  );
};

export default Navbar;
