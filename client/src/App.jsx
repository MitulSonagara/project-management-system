import { Route, Routes } from "react-router-dom";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ThemeProvider } from "@material-tailwind/react";
import AuthLayout from "./components/auth/AuthLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import CheckAuth from "./components/common/CheckAuth"
import { ToastContainer } from "react-toastify"
import { checkAuth } from "./redux/Slices/authSlice";

import { Layout as AdminLayout } from "./components/admin/Layout";
import { Projects as AdminProjects } from "./pages/admin/Projects"
import { Tasks as AdminTasks } from "./pages/admin/Tasks"
import { Dashboard as AdminDashboard } from "./pages/admin/Dashboard"
import { Profile as AdminProfile } from "./pages/admin/Profile"
import { Analytics as AdminAnalytics } from "./pages/admin/Analytics";

import { Layout as ManagerLayout } from "./components/manager/Layout";
import { Projects as ManagerProjects } from "./pages/manager/Projects";
import { Tasks as ManagerTasks } from "./pages/manager/Tasks";
import { Dashboard as ManagerDashboard } from "./pages/manager/Dashboard";
import { Profile as ManagerProfile } from "./pages/manager/Profile";

import { Layout as UserLayout } from "./components/user/Layout";
import { Projects as UserProjects } from "./pages/user/Projects";
import { Tasks as UserTasks } from "./pages/user/Tasks";
import { Dashboard as UserDashboard } from "./pages/user/Dashboard";
import { Profile as UserProfile } from "./pages/user/Profile";


function App() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.global.isDarkMode);
  const isSidebarCollapsed = useSelector((state) => state.global.isSidebarCollapsed);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const theme = {
    card: {
      defaultProps: {
        variant: "filled",
        color: `${isDarkMode ? "gray" : "white"}`,
        shadow: true,
        className: "",
      },
    },
    cardHeader: {
      defaultProps: {
        variant: `${isDarkMode ? "gray" : "white"}`,
        color: "white",
        shadow: true,
        floated: true,
        className: "",
      },
    },
    button: {
      defaultProps: {
        variant: "filled",
        size: "md",
        color: `${isDarkMode ? "indigo" : "indigo"}`,
        fullWidth: false,
        ripple: true,
        className: "",
      },
    },
    dialog: {
      defaultProps: {
        size: "md",
        dismiss: {},
        animate: {
          unmount: {},
          mount: {},
        },
        className: `${isDarkMode ? "bg-black" : ""}`,
      },
    },
    popover: {
      defaultProps: {
        placement: "top",
        offset: 5,
        dismiss: {},
        animate: {
          unmount: {},
          mount: {},
        },
        className: `${isDarkMode ? "bg-black" : ""}`,
      },
    },
    typography: {
      defaultProps: {
        variant: "paragraph",
        color: "inherit",
        textGradient: false,
        className: `${isDarkMode ? "text-white" : ""}`,
      },
    },
    input: {
      defaultProps: {
        variant: "outlined",
        size: "md",
        color: "indigo",
        label: "",
        error: false,
        success: false,
        icon: undefined,
        labelProps: undefined,
        containerProps: undefined,
        shrink: false,
        className: `${isDarkMode ? "text-white" : ""}`,
      },
    },
    select: {
      defaultProps: {
        variant: "outlined",
        color: "indigo",
        size: "md",
        label: "",
        error: false,
        success: false,
        arrow: undefined,
        value: undefined,
        onChange: undefined,
        selected: undefined,
        offset: 5,
        dismiss: {},
        animate: {
          unmount: {},
          mount: {},
        },
        autoHeight: false,
        lockScroll: false,
        labelProps: {},
        menuProps: {},
        className: "",
        disabled: false,
        containerProps: undefined,
      },
      styles: {
        base: {
          container: {
            position: "relative",
            width: "w-full",
            minWidth: "min-w-[200px]",
          },
          select: {
            peer: "peer",
            width: "w-full",
            height: "h-full",
            bg: "bg-transparent",
            color: "text-blue-gray-700",
            fontFamily: "font-sans",
            fontWeight: "font-normal",
            textAlign: "text-left",
            outline: "outline outline-0 focus:outline-0",
            disabled: "disabled:bg-blue-gray-50 disabled:border-0",
            transition: "transition-all",
          },
          arrow: {
            initial: {
              display: "grid",
              placeItems: "place-items-center",
              position: "absolute",
              top: "top-2/4",
              right: "right-2",
              pt: "pt-px",
              width: "w-5",
              height: "h-5",
              color: "text-blue-gray-400",
              transform: "rotate-0 -translate-y-2/4",
              transition: "transition-all",
            },
            active: {
              transform: "rotate-180",
              mt: "mt-px",
            },
          },
          label: {
            display: "flex",
            width: "w-full",
            height: "h-full",
            userSelect: "select-none",
            pointerEvents: "pointer-events-none",
            position: "absolute",
            left: "left-0",
            fontWeight: "font-normal",
            transition: "transition-all",
          },
          menu: {
            width: "w-full",
            maxHeight: "max-h-96",
            bg: `${isDarkMode ? "bg-black" : "bg-white"}`,
            p: "p-3",
            border: "border border-blue-gray-50",
            borderRadius: "rounded-md",
            boxShadow: "shadow-lg shadow-blue-gray-500/10",
            fontFamily: "font-sans",
            fontSize: "text-sm",
            fontWeight: "font-normal",
            color: `${isDarkMode ? "text-white" : ""}`,
            overflow: "overflow-auto",
            outline: "focus:outline-none",
          },
          option: {
            initial: {
              pt: "pt-[9px]",
              pb: "pb-2",
              px: "px-3",
              borderRadius: "rounded-md",
              lightHeight: "leading-tight",
              cursor: "cursor-pointer",
              userSelect: "select-none",
              background: "hover:bg-blue-gray-50 focus:bg-blue-gray-50",
              opacity: "hover:bg-opacity-80 focus:bg-opacity-80",
              color: "hover:text-blue-gray-900 focus:text-blue-gray-900",
              outline: "outline outline-0",
              transition: "transition-all",
            },
            active: {
              bg: "bg-blue-gray-50 bg-opacity-80",
              color: "text-blue-gray-900",
            },
            disabled: {
              opacity: "opacity-50",
              cursor: "cursor-not-allowed",
              userSelect: "select-none",
              pointerEvents: "pointer-events-none",
            },
          },
        },
      }
    }
  }

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <ThemeProvider value={theme}>
      <main>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme={isDarkMode ? "dark" : "light"}
        />
        <Routes>
          <Route
            path="/"
            element={
              <CheckAuth />
            }
          />

          <Route
            path="/auth"
            element={
              <CheckAuth>
                <AuthLayout />
              </CheckAuth>
            }
          >
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          <Route
            path="/admin"
            element={
              <CheckAuth>
                <AdminLayout isSidebarCollapsed={isSidebarCollapsed} />
              </CheckAuth>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="tasks" element={<AdminTasks />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="chat" element={<Chat />} />
          </Route>

          <Route
            path="/user"
            element={
              <CheckAuth>
                <UserLayout isSidebarCollapsed={isSidebarCollapsed} />
              </CheckAuth>
            }
          >
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="projects" element={<UserProjects />} />
            <Route path="tasks" element={<UserTasks />} />
            <Route path="chat" element={<Chat />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>

          <Route
            path="/manager"
            element={
              <CheckAuth>
                <ManagerLayout isSidebarCollapsed={isSidebarCollapsed} />
              </CheckAuth>
            }
          >
            <Route path="dashboard" element={<ManagerDashboard />} />
            <Route path="projects" element={<ManagerProjects />} />
            <Route path="tasks" element={<ManagerTasks />} />
            <Route path="chat" element={<Chat />} />
            <Route path="profile" element={<ManagerProfile />} />
          </Route>

        </Routes>
      </main>
    </ThemeProvider>
  );
}

export default App;