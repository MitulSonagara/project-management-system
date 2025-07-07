import React, { useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { Draggable } from 'react-beautiful-dnd';
import EditTaskModal from './EditTaskModal';
import {
    Input,
    Select,
    Option,
    Card,
    CardBody,
    Typography,
    Button,
    Avatar,
    Chip,
    Dialog,
    DialogBody,
    Textarea,
    Popover,
    PopoverHandler,
    PopoverContent,
} from "@material-tailwind/react";
import { PlusSquare, Trash2, } from 'lucide-react';
import Multiselect from '../Multiselect';
import { useSelector } from 'react-redux';
import CommentsModal from './CommentsModal';
import TaskInfo from './TaskInfo';

const Column = ({ color, name, id, tasks, membersList, submitNewTask, handleTaskDelete, handleEditTask, submitNewComment, projectId, tasksList }) => {
    const [open, setOpen] = useState(false);
    const { register, handleSubmit, reset, control, setError, clearErrors, formState: { errors } } = useForm();
    const handleOpen = () => setOpen(!open);
    const [attachments, setAttachments] = useState([])
    const user = useSelector((state) => state.auth.user)
    const onSubmit = async (data) => {
        const taskData = new FormData();
        taskData.append("name", data.name);
        taskData.append("description", data.description);
        taskData.append("priority", data.priority);
        taskData.append("dueDate", data.dueDate);
        taskData.append("projectId", projectId);
        taskData.append("createdBy", user._id);
        taskData.append("columnId", id);
        taskData.append("state", name);
        attachments.forEach((file, index) => {
            taskData.append(`attachments`, file);
        });
        data.assignees.forEach((assignee) => {
            taskData.append("assignees[]", assignee.value);
        })
        data.dependencies?.forEach((dependencie) => {
            taskData.append("dependencies[]", dependencie.value);
        })
        submitNewTask(taskData)
        handleOpen();
        reset();
        setAttachments([])
    };

    // File validation
    const validateFileTypes = (files) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'text/plain'];
        for (let i = 0; i < files.length; i++) {
            if (!validTypes.includes(files[i].type)) {
                setError("file", {
                    type: "manual",
                    message: "Only JPEG, PNG, JPG, TXT and PDF files are allowed",
                });
                return false;
            }
        }
        clearErrors("file"); // Clear error if files are valid
        return true;
    };

    return (
        <div className="flex flex-col">
            <div className="relative px-4 flex justify-between h-10 w-[340px] items-center rounded-xl bg-white font-medium text-black dark:bg-gray-500 dark:text-white">
                <div
                    className="absolute rounded-l-xl left-0 top-0 h-[100%] w-[8px] "
                    style={{ backgroundColor: `${color}` }}
                />
                <div>{name}</div>
                <button onClick={handleOpen} className="text-gray-700 dark:text-white">
                    <PlusSquare />
                </button>
                <Dialog size="sm" open={open} handler={handleOpen}>
                    <DialogBody>
                        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center p-4">
                            <div className="flex flex-col gap-4 min-w-[100%] m-auto">
                                <p className="text-2xl text-gray-800 font-bold dark:text-white">
                                    Create Task
                                </p>
                                <Input
                                    name="name"
                                    color="indigo"
                                    label="Task Name"
                                    {...register("name", { required: "Task Name is required" })}
                                    className="dark:text-white text-gray-800"
                                />
                                <Textarea
                                    label="Task Description"
                                    {...register("description", {
                                        required: "Task Description is required",
                                    })}
                                    color="indigo"
                                    className="dark:text-white text-gray-800"
                                />
                                <Controller
                                    name="priority"
                                    control={control}
                                    rules={{ required: "Please select the task priority" }}
                                    render={({ field }) => (
                                        <Select
                                            label="Task Priority"
                                            {...field}
                                            className="text-gray-800 dark:text-white"
                                        >
                                            <Option className="text-gray-800 dark:text-white" value="High">
                                                High
                                            </Option>
                                            <Option className="text-gray-800 dark:text-white" value="Medium">
                                                Medium
                                            </Option>
                                            <Option className="text-gray-800 dark:text-white" value="Low">
                                                Low
                                            </Option>
                                        </Select>
                                    )}
                                />
                                <Controller
                                    name="assignees"
                                    control={control}
                                    rules={{ required: "Please select at least one assignee" }}
                                    render={({ field }) => (
                                        <Multiselect
                                            options={membersList.map((user) => ({
                                                label: user.name,
                                                value: user._id,
                                            }))}
                                            selected={field.value || []}
                                            onChange={field.onChange}
                                            placeholder="Select assignees"
                                        />
                                    )}
                                />
                                <Controller
                                    name="dependencies"
                                    control={control}
                                    render={({ field }) => (
                                        <Multiselect
                                            options={tasksList.map((task) => ({
                                                label: task.name,
                                                value: task._id,
                                            }))}
                                            selected={field.value || []}
                                            onChange={field.onChange}
                                            placeholder="Select Dependencies"
                                        />
                                    )}
                                />
                                <input
                                    type='date'
                                    name="dueDate"
                                    color="indigo"
                                    label="Due Date"
                                    placeholder="yyyy-mm-dd"
                                    {...register("dueDate", { required: "Due Date is required" })}
                                    className="w-full h-full bg-transparent text-gray-700 font-sans font-normal outline-none focus:outline-none disabled:bg-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all placeholder:opacity-100 focus:placeholder:opacity-100 text-sm px-3 py-2.5 rounded-lg border border-gray-200 focus:border-2 focus:border-indigo-500 dark:text-white"
                                />
                                <input
                                    className="block w-full text-sm text-gray-800 border border-gray-300 rounded-lg cursor-pointer
                                 bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 
                                 dark:placeholder-gray-400 p-2"
                                    id="multiple_files"
                                    type="file" multiple
                                    onChange={(e) => {
                                        const selectedFiles = Array.from(e.target.files);
                                        if (validateFileTypes(selectedFiles)) {
                                            setAttachments(selectedFiles);
                                        }
                                    }}
                                />
                                {errors.file && <p className="text-red-500 text-sm">{errors.file.message}</p>}
                                <Button type="submit" color="indigo" fullWidth>
                                    {"Create New Task"}
                                </Button>
                            </div>
                        </form>
                    </DialogBody>
                </Dialog>
            </div>
            {tasks.map((task, index) => (
                <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                        >
                            {task && <Card className={`mt-2 w-[340px] ${new Date(task.dueDate) < new Date() && task.state !== 'Completed' ? ' border-red-900 border-2' : ''}`} key={task._id} value={task._id}>
                                <CardBody className="p-2">

                                    <div className="divide-y-2">
                                        <div>
                                            <div className="absolute top-3 right-2">
                                                <Popover placement="bottom" className="">
                                                    <PopoverHandler>
                                                        <button><Trash2 className="h-4 w-4 text-red-700" /></button>
                                                    </PopoverHandler>
                                                    <PopoverContent className="w-60 bg-red-50">
                                                        <div className="flex justify-between items-center">
                                                            <Typography variant="h6" color="blue-gray">
                                                                Delete Task?
                                                            </Typography>
                                                            <Button variant="gradient" onClick={() => handleTaskDelete(task._id)} color="red" className="p-2 w-24">
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                            <div className="flex mb-1 items-center justify-between mr-8">
                                                <div className="flex gap-3">
                                                    <Typography variant="h6" color="blue-gray">
                                                        {task.name}
                                                    </Typography>
                                                    <Chip variant="ghost"
                                                        color={task.priority === "High" ? "red" : task.priority === "Medium" ? "yellow" : "green"}
                                                        value={task.priority} size='sm' />
                                                </div>
                                                <Typography variant='small' className={` ${new Date(task.dueDate) < new Date() && task.state !== 'Completed' ? 'text-red-700' : 'text-gray-500'}`}>
                                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                                </Typography>
                                            </div>

                                            <Typography>
                                                {task.description} Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, hic?
                                            </Typography>
                                        </div>
                                        <div className="p-2 flex items-center justify-between">
                                            <div className="flex items-center -space-x-2">
                                                {task.assignees.length > 0 &&
                                                    (
                                                        task.assignees.map((assignee, index) => (
                                                            <Avatar
                                                                key={index}
                                                                size="xs"
                                                                variant="circular"
                                                                alt="user 1"
                                                                className="border-2 border-white hover:z-10 focus:z-10"
                                                                src={`https://ui-avatars.com/api/?background=random&name=${assignee.name}`}
                                                            />
                                                        ))
                                                    )
                                                }
                                            </div>
                                            <div className="flex gap-3 items-center">
                                                <EditTaskModal task={task} editTask={handleEditTask} membersList={membersList} />
                                                <CommentsModal comments={task.comments} taskId={task._id} submitNewComment={submitNewComment} commenterName={user.name} commenterId={user._id} />
                                                <TaskInfo task={task} />
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>}
                        </div>
                    )}
                </Draggable>
            ))}
        </div>
    );
};

export default Column;