import { Button, Dialog, DialogBody, Input, Option, Select, Textarea } from '@material-tailwind/react';
import { FilePen } from 'lucide-react';
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import Multiselect from '../Multiselect';

const EditTaskModal = ({ task, editTask, membersList }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);
    const { register, handleSubmit, reset, control } = useForm();
    const onSubmit = async (data) => {
        const taskData = {
            ...data,
            taskId: task._id,
            assignees: data.assignees.map((assignee) => assignee.value)
        }

        editTask(taskData);

        handleOpen();
        reset();
    }
    return (
        <>
            <button onClick={handleOpen}>
                <FilePen className='h-5 w-5' />
            </button>
            <Dialog size="sm" open={open} handler={handleOpen}>
                <DialogBody>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex items-center p-4">
                        <div className="flex flex-col gap-4 min-w-[100%] m-auto">
                            <p className="text-2xl text-gray-800 font-bold dark:text-white">
                                Edit Task
                            </p>
                            <Input
                                name="name"
                                color="indigo"
                                defaultValue={task.name}
                                label="Task Name"
                                {...register("name", { required: "Task Name is required" })}
                                className="dark:text-white text-gray-800"
                            />
                            <Textarea
                                defaultValue={task.description}
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
                                defaultValue={task.priority}
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
                                rules={{
                                    required: "Please select at least one assignee", // validation rule
                                }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Multiselect
                                            options={membersList.map((user) => ({
                                                label: user.name,
                                                value: user._id,
                                            }))}
                                            selected={field.value || []}
                                            onChange={field.onChange}
                                            placeholder="Select assignees"
                                        />
                                        {/* Show error message */}
                                        {fieldState?.error && (
                                            <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                                        )}
                                    </>
                                )}
                            />
                            <input
                                type='date'
                                name="dueDate"
                                {...register("dueDate")}
                                className="w-full h-full bg-transparent text-gray-700 font-sans font-normal outline-none focus:outline-none disabled:bg-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all placeholder:opacity-100 focus:placeholder:opacity-100 text-sm px-3 py-2.5 rounded-lg border border-gray-200 focus:border-2 focus:border-indigo-500 dark:text-white"
                            />
                            <Button type="submit" color="indigo" fullWidth>
                                {"Edit Task"}
                            </Button>
                        </div>
                    </form>
                </DialogBody>
            </Dialog>
        </>
    )
}

export default EditTaskModal