import React, { useEffect } from 'react'
import Navbar from '../common/Navbar'
import Sidebar from '../common/Sidebar'
import { Outlet } from "react-router-dom";
import { Home, Briefcase, CalendarCheck, MessageCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../../redux/Slices/notificationSlice';
import { toast } from 'react-toastify';
import { socket } from '../../utils/auth';
import { getAllChats, getRecentChats } from '../../redux/Slices/chatSlice';

const userSidebarMenuItems = [
    {
        label: "Dashboard",
        path: "/user/dashboard",
        icon: <Home className="h-6 w-6 text-gray-800 dark:text-gray-100" />
    },
    {
        label: "Projects",
        path: "/user/projects",
        icon: <Briefcase className="h-6 w-6 text-gray-800 dark:text-gray-100" />
    },
    {
        label: "Tasks",
        path: "/user/tasks",
        icon: <CalendarCheck className="h-6 w-6 text-gray-800 dark:text-gray-100" />
    },
    {
        label: "Chat",
        path: "/user/chat",
        icon: <MessageCircle className="h-6 w-6 text-gray-800 dark:text-gray-100" />
    }
]

export const Layout = ({ isSidebarCollapsed }) => {
    const dispatch = useDispatch()
    const { notifications, count } = useSelector((state) => state.notify);
    const { user } = useSelector((state) => state.auth)

    useEffect(() => {
        dispatch(fetchNotifications(user._id))
    }, [])

    useEffect(() => {
        socket.on("connect", () => { });
        socket.on("projectNotification", (members) => {
            if (members.members.includes(user._id)) {
                dispatch(fetchNotifications(user._id))
                toast.info(members.message)
            }
        });
        socket.on("taskNotification", (members) => {
            if (members.members.includes(user._id)) {
                dispatch(fetchNotifications(user._id))
                toast.info(members.message)
            }
        });
        socket.on("chatNotification", (members) => {
            if (members.members.includes(user._id)) {
                dispatch(getAllChats())
                dispatch(getRecentChats())
                // toast.info(members.message)
            }
        })
        return () => {
            socket.off("receiveMessage");
        };
    }, [])
    return (
        <>
            <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">

                <Sidebar menuItems={userSidebarMenuItems} />

                <main
                    className={`flex w-full flex-col ${isSidebarCollapsed ? "" : "md:pl-64"
                        }`}
                >
                    <Navbar notifications={notifications} count={count} />
                    <div className="h-full w-full dark:bg-gray-800 overflow-auto bg-gray-200">
                        <Outlet />
                    </div>
                </main>
            </div>
        </>
    )
}