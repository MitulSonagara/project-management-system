import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import {
    Input,
    Textarea,
    Select,
    Option,
    Button,
    DialogBody,
    Dialog
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import ProjectCard from "../../components/admin/ProjectCard";
import { toast } from "react-toastify";
import { getAllProjects, createProject } from "../../redux/Slices/admin/projectSlice";
import Multiselect from "../../components/Multiselect";
import { getAllUsers } from "../../redux/Slices/userSlice";

export const Projects = () => {
    const dispatch = useDispatch()
    const usersList = useSelector(
        (state) => state.user.usersList
    )
    const projectsList = useSelector(
        (state) => state.adminProject.projectsList
    )
    const isSidebarCollapsed = useSelector(
        (state) => state.global.isSidebarCollapsed
    );
    const { register, handleSubmit, reset, control } = useForm();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);

    const onSubmit = async (data) => {
        const projectData = {
            ...data,
            teamMembers: data.teamMembers.map((member) => member.value)
        }
        dispatch(createProject(projectData)).then((data) => {
            if (data?.payload?.success) {
                toast.success(data?.payload?.message)
                dispatch(getAllProjects())
            } else {
                toast.error(data?.payload?.message)
            }
        })
        reset();
        setOpen(false);
    };

    useEffect(() => {
        dispatch(getAllProjects())
        dispatch(getAllUsers())
    }, []);

    return (
        <div className="p-6">
            <div className={`grid ${isSidebarCollapsed ? "grid-cols-4" : "grid-cols-3"} gap-8`}>

                {projectsList.map((project, index) => (
                    <ProjectCard key={index} project={project} />
                ))}

            </div>

            <button
                onClick={handleOpen}
                className="fixed rounded-full bottom-20 right-20 bg-white p-4 shadow-xl dark:bg-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
                <Plus />
            </button>
            <Dialog size="sm" open={open} handler={handleOpen}>
                <DialogBody>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex items-center p-4">
                        <div className="flex flex-col gap-4 min-w-[100%] m-auto">
                            <p className="text-2xl text-gray-800 font-bold dark:text-white">
                                Create Project
                            </p>
                            <Input
                                name="name"
                                color="indigo"
                                label="Project Name"
                                {...register("name")}
                                className="dark:text-white text-gray-800"
                            />
                            <Textarea
                                label="Project Description"
                                {...register("description")}
                                color="indigo"
                                className="dark:text-white text-gray-800"
                            />
                            <Controller
                                name="projectManager"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        label="Project Manager"
                                        {...field}
                                        className="text-gray-800 dark:text-white"
                                    >
                                        {usersList.map((user) => (
                                            <Option key={user._id} value={user._id} className="text-gray-800 dark:text-white">
                                                {user.name}
                                            </Option>
                                        ))}
                                    </Select>
                                )}
                            />

                            <Controller
                                name="teamMembers"
                                control={control}
                                rules={{ required: "Please select at least one member" }}
                                render={({ field }) => (
                                    <Multiselect
                                        options={usersList.map((user) => ({
                                            label: user.name,
                                            value: user._id,
                                        }))}
                                        selected={field.value || []}
                                        onChange={field.onChange}
                                        placeholder="Select team members"
                                    />
                                )}
                            />


                            <Button type="submit" color="indigo" fullWidth>
                                {"Create New Project"}
                            </Button>
                        </div>
                    </form>
                </DialogBody>
            </Dialog>
        </div>
    );
};