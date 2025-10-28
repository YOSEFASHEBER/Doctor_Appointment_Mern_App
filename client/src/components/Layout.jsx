import React, { useState } from "react";
import "../layout.css";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { LuListChecks } from "react-icons/lu";
import { FaUserDoctor } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { BiLogOut } from "react-icons/bi";
import { VscChromeClose } from "react-icons/vsc";
import { FaClinicMedical } from "react-icons/fa";
import { RiExpandRightFill } from "react-icons/ri";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { useSelector } from "react-redux";
import { HiMiniUsers } from "react-icons/hi2";
import { Avatar, Badge } from "antd";

function Layout({ children }) {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
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
  ];
  const doctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: <FaHome></FaHome>,
    },
    {
      name: "Appointments",
      path: "/doctor/appointments",
      icon: <LuListChecks></LuListChecks>,
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: <CgProfile></CgProfile>,
    },
  ];
  const adminMenu = [
    {
      name: "Home",
      path: "/",
      icon: <FaHome />,
    },
    {
      name: "Users",
      path: "/users",
      icon: <HiMiniUsers />,
    },
    {
      name: "Doctors",
      path: "/doctors",
      icon: <FaUserDoctor />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <CgProfile />,
    },
  ];
  const menuToBeRendered = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;
  const navigate = useNavigate();

  return (
    <div className="d-flex layout">
      <div className="d-flex main">
        <div className={collapsed ? "collapsed-sidebar" : "sidebar"}>
          <div className="sidebar-header">
            {!collapsed ? <h1>My-Clinic</h1> : <FaClinicMedical />}
            {collapsed && <br />}
            {!collapsed ? (
              <h4>
                {user?.isAdmin ? "Admin" : user?.isDoctor ? "Doctor" : "User"}
              </h4>
            ) : (
              <h6>
                {user?.isAdmin ? "Admin" : user?.isDoctor ? "Doctor" : "User"}
              </h6>
            )}
          </div>
          <div className="menu">
            {menuToBeRendered.map((menu) => {
              const isActve = location.pathname === menu.path;
              return (
                <div
                  key={menu.path}
                  className={
                    !collapsed
                      ? `d-flex menu-item`
                      : " d-flex menu-item menu-item-center"
                  }
                >
                  <Link to={menu.path} className={`${isActve && "active"}`}>
                    {" "}
                    <span className="space">{menu.icon} </span>{" "}
                    {!collapsed && menu.name}
                  </Link>
                </div>
              );
            })}
            <div
              className={`${
                !collapsed
                  ? `d-flex menu-item`
                  : " d-flex menu-item menu-item-center"
              }`}
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
            >
              <Link to={"/logout"}>
                {" "}
                <span className="space">{<BiLogOut />} </span>{" "}
                {!collapsed && "Logout"}
              </Link>
            </div>
          </div>
        </div>
        <div className="content">
          <div className={!collapsed ? "header" : "header-collapsed"}>
            <div
              className="close-icon"
              onClick={() => setCollapsed((prev) => !prev)}
            >
              <div>
                {" "}
                {!collapsed ? <VscChromeClose /> : <RiExpandRightFill />}
              </div>
            </div>
            <div className="header-right-side">
              <Link className="anchor me-2" to={"/profile"}>
                {user?.name}
              </Link>
              <Link to={"/notifications"}>
                <Badge count={user?.unSeenNotifications.length}>
                  <MdOutlineNotificationsActive className="fs-3" />
                </Badge>
              </Link>
            </div>
          </div>

          <div className={!collapsed ? "body" : "body-collapsed"}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
