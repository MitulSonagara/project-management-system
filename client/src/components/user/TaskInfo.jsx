import React, { useState } from 'react'
import {
    Dialog,
    Typography,
    Avatar,
    Button
} from "@material-tailwind/react";
import { Info } from 'lucide-react';
import { API_BASE_URL } from '../../appConfig';

const TaskInfo = ({ task }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);
    return (
        <>
            <button onClick={handleOpen} className='text-gray-700 dark:text-white'>
                <Info className="h-5 w-5" />
            </button>
            <Dialog open={open} handler={handleOpen} className='overflow-auto h-3/4'>
                <div className="max-w-4xl mx-auto p-4">

                    <Typography variant="h2" color='gray' className='text-center m-2'>{task.name}</Typography>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-50">Description</h3>

                    <p className="text-gray-800 dark:text-gray-50 font-medium mb-4">{task.description || "No description provided."} Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maiores, delectus!
                    </p>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <h3 className="font-semibold text-gray-800 dark:text-gray-50">Priority</h3>
                            <p className="text-gray-800 dark:text-gray-50">{task.priority}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 dark:text-gray-50">State</h3>
                            <p className="text-gray-800 dark:text-gray-50">{task.state}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 dark:text-gray-50">Due Date</h3>
                            <p className="text-gray-800 dark:text-gray-50">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not set"}</p>
                        </div>
                    </div>

                    <div className="mt-3">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-50">Created By</h3>
                        <div className="flex items-center gap-2">
                            <Avatar src={`https://ui-avatars.com/api/?background=random&name=${task.createdBy.name}`} alt="avatar" size='sm' />
                            <div>
                                <p className="text-gray-800 dark:text-gray-50 font-medium">{task.createdBy.name}</p>
                                <Typography variant="small" color="gray" className="font-normal">
                                    {task.createdBy.email}
                                </Typography>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-50">Assignees</h3>
                        <div className="grid grid-cols-3 ">
                            {task.assignees.length > 0 ? (
                                task.assignees.map((assignee, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Avatar src={`https://ui-avatars.com/api/?background=random&name=${assignee.name}`} alt="avatar" size='sm' />
                                        <div>
                                            <p className="text-gray-800 dark:text-gray-50 font-medium">{assignee.name}</p>
                                            <Typography variant="small" color="gray" className="font-normal">
                                                {assignee.email}
                                            </Typography>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600">No assignees</p>
                            )}
                        </div>
                    </div>
                    <div className="mt-3">
                        <h3 className="font-semibold text-gray-800">Dependencies</h3>
                        <div className="grid grid-cols-3 ">
                            {task.dependencies.length > 0 ? (
                                task.dependencies.map((dependencie, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div>
                                            <p className="text-gray-800 font-medium">{dependencie.name}</p>
                                            <Typography variant="small" color="gray" className="font-normal">
                                                {dependencie.state}
                                            </Typography>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600">No Dependencies</p>
                            )}
                        </div>
                    </div>
                    <div className="mt-3">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-50">Attachments</h3>
                        {task.attachments.length ? (
                            task.attachments.map((attachment, index) => (

                                <Button
                                    key={index}
                                    onClick={() => window.open(
                                        API_BASE_URL + "/uploads/" + attachment.fileName, "_blank", "noopener,noreferrer"
                                    )}
                                    variant='text' className='text-gray-700 outline outline-1 m-0.5' size='sm'>{attachment.originalName}</Button>
                            ))
                        ) : (
                            <p className="text-gray-600">No attachments</p>
                        )}
                    </div>

                    <div className="mt-3">
                        <h3 className="font-semibold text-gray-800">Comments</h3>
                        {task.comments.length > 0 ? (
                            task.comments.map((comment, index) => (
                                <article key={index} class="p-2 text-base bg-white rounded-lg ">
                                    <footer class="flex justify-between items-center mb-2">
                                        <div class="flex items-center">
                                            <p class="inline-flex items-center mr-3 text-sm text-gray-800">
                                                <img
                                                    class="mr-2 w-6 h-6 rounded-full"
                                                    src={`https://ui-avatars.com/api/?background=random&name=${comment.commenterName}`} />{comment.commenterName}</p>
                                            <p class="text-sm text-gray-600 "><time pubdate datetime="2022-02-08"
                                                title="February 8th, 2022">{comment.createdAt}</time></p>
                                        </div>

                                    </footer>
                                    <p class="text-gray-500 ">{comment.content}</p>

                                </article>
                            ))
                        ) : (
                            <p className="text-gray-600">No comments yet.</p>
                        )}
                    </div>
                </div>

            </Dialog>
        </>
    )
}

export default TaskInfo