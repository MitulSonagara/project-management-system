import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  User,
  X,
} from "lucide-react";
import { setIsSidebarCollapsed } from "../../redux/Slices/globalSlice";
import { useLocation } from "react-router-dom";
import { logout } from "../../redux/Slices/authSlice";

const Sidebar = ({ menuItems }) => {
  const dispatch = useDispatch();
  const isSidebarCollapsed = useSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const user = useSelector((state) => state.auth.user)

  const handleSignOut = () => {
    dispatch(logout());
  };

  const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between
    transition-all duration-300 h-full z-40 dark:bg-gray-900 bg-white
    ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}
  `;

  return (
    <div className={sidebarClassNames}>
      <div className="flex h-[100%] w-full flex-col justify-start">
        {/* TOP LOGO */}
        <div className="z-50 flex min-h-[76px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-gray-900">
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            TaskBoard
          </div>
          {isSidebarCollapsed ? null : (
            <button
              className="py-3"
              onClick={() => {
                dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
              }}
            >
              <X className="h-5 w-5 text-gray-800 hover:text-gray-500 dark:text-white" />
            </button>
          )}
        </div>

        {/* NAVBAR LINKS */}
        <nav className="z-10 w-full">
          {menuItems.map((item, index) => (
            <SidebarLink
              key={index}
              icon={item.icon}
              text={item.label}
              to={item.path}
            />
          ))}
        </nav>
      </div>
      <div className="z-10 mt-32 flex w-full flex-col items-center gap-4 bg-white px-8 py-4 dark:bg-gray-900 md:hidden">
        <div className="flex w-full items-center">
          <div className="align-center flex h-9 w-9 justify-center">

            <User className="h-6 w-6 cursor-pointer self-center rounded-full dark:text-white" />
          </div>
          <span className="mx-3 text-gray-800 dark:text-white">
            {user?.name}
          </span>
          <button
            className="self-start rounded bg-blue-400 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 md:block"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

const SidebarLink = ({ icon, text, to }) => {
  const pathname = useLocation().pathname;
  const isActive = pathname === to || (pathname === "/" && to === "/dashboard");
  return (
    <NavLink to={to} className="w-full">
      <div
        className={`relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-700 ${isActive ? "bg-gray-100 text-white dark:bg-gray-600" : ""
          } justify-start px-8 py-3`}
      >
        {isActive && (
          <div className="absolute left-0 top-0 h-[100%] w-[5px] bg-blue-200" />
        )}

        {icon}
        <span className={`font-medium text-gray-800 dark:text-gray-100`}>
          {text}
        </span>
      </div>
    </NavLink>
  );
};

export default Sidebar;