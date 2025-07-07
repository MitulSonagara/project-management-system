import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setIsSidebarCollapsed, setIsDarkMode } from "../../redux/Slices/globalSlice";
import { Bell, Menu, Moon, Settings, Sun, User } from "lucide-react";
import { logout } from "../../redux/Slices/authSlice";
import { Badge, Button, List, ListItem, Popover, PopoverContent, PopoverHandler, Typography } from "@material-tailwind/react";
import { clearNotification, fetchNotifications, markAsReadNotifications } from "../../redux/Slices/notificationSlice";

const Navbar = (notifications) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user)
    const isSidebarCollapsed = useSelector(
        (state) => state.global.isSidebarCollapsed
    );
    const isDarkMode = useSelector((state) => state.global.isDarkMode);
    const data = {
        userId: user._id,
    }

    const handleSignOut = () => {
        dispatch(logout());
    };

    return (
        <div className="w-full flex items-center justify-between bg-white px-4 py-3 dark:bg-gray-900 outline outline-1 outline-gray-400 dark:outline-gray-700">
            {/* Search Bar */}

            <div className="flex items-center gap-8">
                {!isSidebarCollapsed ? null : (
                    <button
                        onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
                    >
                        <Menu className="h-8 w-8 dark:text-white" />
                    </button>
                )}
            </div>
            {/* Icons */}
            <div className="flex items-center">
                <button
                    onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
                    className={
                        isDarkMode
                            ? `rounded p-2 dark:hover:bg-gray-700`
                            : `rounded p-2 hover:bg-gray-100`
                    }
                >
                    {isDarkMode ? (
                        <Sun className="h-6 w-6 cursor-pointer dark:text-white" />
                    ) : (
                        <Moon className="h-6 w-6 cursor-pointer dark:text-white" />
                    )}
                </button>
                <Popover placement="bottom-end">
                    <PopoverHandler>
                        <button
                            className={
                                isDarkMode
                                    ? `h-min w-min rounded p-2 dark:hover:bg-gray-700`
                                    : `h-min w-min rounded p-2 hover:bg-gray-100`
                            }
                        >
                            {notifications.count > 0
                                ?
                                <Badge content={notifications.count} withBorder>
                                    <Bell className="h-6 w-6 cursor-pointer dark:text-white" />
                                </Badge>
                                :
                                <Bell className="h-6 w-6 cursor-pointer dark:text-white" />
                            }

                        </button>
                    </PopoverHandler>
                    <PopoverContent className="w-80 h-96 overflow-auto p-4">
                        <div className="flex">

                            <Button variant="text" color="red" onClick={() => dispatch(clearNotification({ userId: user._id }))} className="w-full p-2">Clear All</Button>
                            <Button variant="text" color="blue" onClick={() =>
                                dispatch(markAsReadNotifications({ userId: user._id }))
                            } className="w-full p-2">Mark All As Read</Button>
                        </div>
                        <div className="mt-6">
                            {notifications.notifications.length > 0 ? notifications.notifications.map((notification,index) => (

                                <div key={index} className={`flex flex-col items-start mb-2 w-full p-3 rounded-lg text-start leading-tight outline-none ${notification.status == 1 ? `bg-blue-gray-100 text-blue-gray-900` : `bg-gray-50 text-blue-gray-600`}`}>
                                    <Typography variant="h6">
                                        {notification.title}
                                    </Typography>
                                    <Typography variant="small" color="gray" className="font-normal">
                                        {notification.message}
                                    </Typography>
                                </div>
                            )) :
                                <Typography variant="small" color="gray" className="font-normal">
                                    No new notifications
                                </Typography>
                            }
                        </div>
                    </PopoverContent>
                </Popover>

                <div className="ml-2 mr-5 hidden min-h-[2em] w-[0.1rem] bg-gray-200 md:inline-block"></div>
                <div className="hidden items-center justify-between md:flex">
                    <div className="align-center flex h-9 w-9 justify-center">
                        <User className="h-6 w-6 cursor-pointer self-center rounded-full dark:text-white" />
                    </div>
                    <span className="mx-3 text-gray-800 dark:text-white">
                        {user?.name}
                    </span>
                    <button
                        className="hidden rounded bg-blue-400 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 md:block"
                        onClick={handleSignOut}
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;