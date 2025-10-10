import React from "react";
import "../layout.css";
import { Link, useLocation } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { LuListChecks } from "react-icons/lu";
import { FaUserDoctor } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { BiLogOut } from "react-icons/bi";

function Layout({ children }) {
  const location = useLocation();
  const userMenu = [
    {
      name: "Home",
      path: "/",
      icon: <FaHome></FaHome>,
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: <LuListChecks></LuListChecks>,
    },
    {
      name: "Apply Doctor",
      path: "/apply-doctor",
      icon: <FaUserDoctor></FaUserDoctor>,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <CgProfile></CgProfile>,
    },
    {
      name: "Logout",
      path: "/logout",
      icon: <BiLogOut></BiLogOut>,
    },
  ];

  const menuToBeRendered = userMenu;
  return (
    <div className="d-flex layout">
      <div className="d-flex main">
        <div className="sidebar">
          <div className="sidebar-header">
            <h1>ጤናጣቢያ</h1>
          </div>
          <div className="menu">
            {menuToBeRendered.map((menu) => {
              const isActve = location.pathname === menu.path;
              return (
                <div className={`d-flex menu-item`}>
                  <Link to={menu.path} className={isActve && "active"}>
                    {" "}
                    <span className="space">{menu.icon} </span> {menu.name}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
        <div className="content">
          <div className="header">header</div>
          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
