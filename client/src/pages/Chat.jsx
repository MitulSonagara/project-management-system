import React, { useEffect, useRef } from 'react'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {
    Button,
    Card,
    Input,
    List,
    ListItem
} from "@material-tailwind/react";
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../redux/Slices/userSlice';
import { Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { clearUser, getAllChats, getRecentChats, markAsReadChats, sendChat, setUser } from '../redux/Slices/chatSlice';

const Chat = () => {
    const dispatch = useDispatch()
    const { register, handleSubmit, reset } = useForm()
    const usersList = useSelector((state) => state.user.usersList);
    const recentChats = useSelector((state) => state.chat.recentChats);
    const chatUser = useSelector((state) => state.chat.chatUser)
    const allChats = useSelector((state) => state.chat.allChats)
    const user = useSelector((state) => state.auth.user)
    const me = useSelector((state)=>state.auth.user)

    const lastChat = useRef(null)

    const onSubmit = (data) => {
        const chatData = {
            ...data,
            receiver: chatUser.id
        }
        dispatch(sendChat(chatData));
        dispatch(getAllChats());
        dispatch(getRecentChats())
        reset()
    }

    useEffect(() => {
        dispatch(getAllUsers())
        dispatch(getRecentChats())
        dispatch(clearUser())
    }, [])

    useEffect(() => {
        if (lastChat.current) {
            lastChat.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [allChats, chatUser]);

    return (
        <div className='p-6'>
            <div className="flex gap-3">
                <Card className="h-[calc(100vh-7rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
                    <div className="mb-2 p-4 bg-gray-300 dark:bg-gray-800 rounded-lg">
                        <Autocomplete
                            disablePortal
                            options={usersList}
                            getOptionLabel={(option) => option.name}
                            onChange={(event, value) => {
                                if (value) {
                                    dispatch(setUser(value))
                                    dispatch(getAllChats())
                                    dispatch(markAsReadChats(value._id))
                                }
                            }}
                            renderInput={(params) => <TextField {...params} label="Search..." />}
                        />
                    </div>
                    <List className='overflow-auto'>
                        {
                            recentChats.map((user, index) => (
                                <div className={`p-3 rounded hover:bg-gray-400 dark:hover:bg-gray-700  flex flex-col ${!user.isRead && user.sender != me._id?"bg-gray-500 dark:bg-gray-700":"bg-gray-300 dark:bg-gray-800"}`} key={index} onClick={() => {
                                    dispatch(setUser(user));
                                    dispatch(getAllChats());
                                    dispatch(getRecentChats())
                                    dispatch(markAsReadChats(user._id))
                                }}>
                                    <div className="flex items-start">
                                        <div className="flex flex-col w-full max-w-[320px]">
                                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</span>
                                                <span className="text-sm font-normal text-gray-600 dark:text-gray-400">{new Date(user.time).toLocaleString()}</span>
                                            </div>
                                            <p className="text-sm font-normal py-1 text-gray-900 dark:text-white"> {user.chat}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </List>
                </Card>
                {chatUser ?
                    <div className="h-[calc(100vh-7rem)] border-x-2 border-white dark:border-gray-900 w-full shadow-xl bg-gray-300 dark:bg-gray-800 rounded-lg shadow-blue-gray-900/5 flex flex-col">
                        <div className='w-full flex items-center rounded-lg justify-between bg-white px-4 py-3 dark:bg-gray-900 outline-gray-400 dark:outline-gray-700 dark:text-white'>
                            {chatUser.name}
                        </div>
                        <div className='grow gap-2 m-2 overflow-auto'>
                            {allChats.map((chat, index) => (
                                <div
                                    key={index}
                                    ref={index === allChats.length - 1 ? lastChat : null}
                                    className={`flex ${user._id == chat.sender ? "justify-end" : ""}`}>
                                    <div className="flex flex-col m-1 w-full max-w-[320px] py-1 px-2 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-900">
                                        <p className="text-sm font-normal text-gray-900 dark:text-white">{chat.chat}</p>
                                        <span className="text-sm flex justify-end font-normal text-gray-500 dark:text-gray-400">{new Date(chat.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>

                            ))}
                        </div>
                        <div className='w-full flex gap-2 items-center rounded-lg justify-between bg-white p-1 dark:bg-black outline-gray-400 dark:outline-gray-700'>
                            <form onSubmit={handleSubmit(onSubmit)} className='flex items-center w-full gap-2'>

                                <Input label="Message" name='chat' {...register("chat", { required: "content is required" })} size='lg' />
                                <Button type='submit' size='md' className='py-2.5'>
                                    <Send />
                                </Button>
                            </form>
                        </div>
                    </div>
                    :
                    <div className="h-[calc(100vh-7rem)] border-x-2 border-white w-full shadow-xl bg-gray-300 dark:bg-gray-800 rounded-lg shadow-blue-gray-900/5 flex flex-col justify-center items-center">
                        <p>No chat selected</p>
                    </div>
                }
            </div>
        </div>
    )
}

export default Chat