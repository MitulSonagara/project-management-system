import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Column from '../../components/manager/Column';
import { PlusSquare, Search } from 'lucide-react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import {
    Input,
    Select,
    Option,
    Button,
    DialogBody,
    Dialog
} from '@material-tailwind/react';
import { fetchColumns, updateTaskOrder, updateLocalTaskOrder, setSelectedProjectId, createColumn, setPriority, setSearch, setDuedate } from '../../redux/Slices/manager/columnSlice';
import { useForm } from 'react-hook-form';
import { getAllProjects } from '../../redux/Slices/manager/projectSlice';
import { toast } from 'react-toastify';
import { createTask, addComment, deleteTask, editTask, getAllTasks } from '../../redux/Slices/manager/taskSlice';
import { getProjectMembers } from '../../redux/Slices/userSlice';

export const Tasks = () => {
    const dispatch = useDispatch();
    const { register, handleSubmit, reset } = useForm();
    const [searchText, setSearchText] = useState("");

    const membersList = useSelector((state) => state.user.membersList);
    const tasksList = useSelector((state) => state.managerTask.tasksList)
    const projectsList = useSelector((state) => state.managerProject.projectsList);
    const columnsList = useSelector((state) => state.managerColumns.columnsList);
    const isSidebarCollapsed = useSelector((state) => state.global.isSidebarCollapsed);
    const isProjectSelected = useSelector((state) => state.managerColumns.isProjectSelected);
    const filters = useSelector((state) => state.managerColumns.filters);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);

    const onSearchChange = ({ target }) => setSearchText(target.value);

    const handleProjectSelection = (projectId) => {
        dispatch(setSelectedProjectId(projectId))
        dispatch(fetchColumns());
        dispatch(getAllTasks(projectId))
    };

    const handlePriorityChange = (priority) => {
        dispatch(setPriority(priority));
        dispatch(fetchColumns());
    }

    const handleSearch = () => {
        dispatch(setSearch(searchText));
        dispatch(fetchColumns())
    }

    const handleDateChange = ({ target }) => {
        dispatch(setDuedate(target.value));
        dispatch(fetchColumns())
    }

    const onSubmit = async (data) => {
        const columnData = {
            ...data,
            projectId: filters.selectedProject,
        };
        dispatch(createColumn(columnData)).then((data) => {
            if (data?.payload?.success) {
                toast.success(data?.payload?.message)
                dispatch(fetchColumns());

            } else {
                toast.error(data?.payload?.message)
            }
        })
        handleOpen();
        reset();
    };

    const submitNewTask = async (data) => {
        dispatch(createTask(data)).then((data) => {
            if (data?.payload?.success) {
                toast.success(data?.payload?.message)
                dispatch(fetchColumns());
                dispatch(getAllTasks(filters.selectedProject))
            } else {
                toast.error(data?.payload?.message)
            }
        })
    }

    const handleEditTask = async (data) => {
        dispatch(editTask(data)).then((data) => {
            if (data?.payload.success) {
                toast.success(data?.payload?.message)
                dispatch(fetchColumns());
            } else {
                toast.error(data?.payload?.message)
            }
        })
    }


    const submitNewComment = (data) => {
        dispatch(addComment(data)).then((data) => {
            if (data?.payload?.success) {
                toast.success(data?.payload?.message)
                dispatch(fetchColumns());
            } else {
                toast.error(data?.payload?.message)
            }
        })
    }

    const handleTaskDelete = (taskId) => {
        dispatch(deleteTask(taskId)).then((data) => {
            if (data?.payload?.success) {
                toast.success(data?.payload?.message)
                dispatch(fetchColumns());
            } else {
                toast.error(data?.payload?.message)
            }
        })
    };

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;

        const sourceColumnId = columnsList[source.droppableId]._id;
        const destColumnId = columnsList[destination.droppableId]._id;
        const destColumnName = columnsList[destination.droppableId].name;
        if (sourceColumnId === destColumnId) {
            const reorderedTasks = Array.from(columnsList[source.droppableId].tasks);
            const [removedTask] = reorderedTasks.splice(source.index, 1);
            reorderedTasks.splice(destination.index, 0, removedTask);
            dispatch(updateLocalTaskOrder({
                sourceColumnId,
                destColumnId,
                destColumnName,
                sourceIndex: source.index,
                destIndex: destination.index,
                task: removedTask,
            }));
            await Promise.all(
                reorderedTasks.map((task, index) => {
                    return dispatch(updateTaskOrder({
                        taskId: task._id,
                        newColumnId: sourceColumnId,
                        newIndex: index,
                    }));
                })
            );
        }
        else {
            const draggedTask = columnsList[source.droppableId].tasks[source.index];
            dispatch(updateLocalTaskOrder({
                sourceColumnId,
                destColumnId,
                destColumnName,
                sourceIndex: source.index,
                destIndex: destination.index,
                task: draggedTask,
            }));
            dispatch(updateTaskOrder({
                taskId: draggableId,
                newColumnId: destColumnId,
                newIndex: destination.index,
            }));
        }
    };

    useEffect(() => {
        dispatch(getAllProjects({}))
    }, []);

    useEffect(() => {
        if (filters.selectedProject) {
            dispatch(fetchColumns());
            dispatch(getProjectMembers(filters.selectedProject))
            dispatch(getAllTasks(filters.selectedProject))
        }
    }, [filters.selectedProject, dispatch]);

    return (
        <>
            {isProjectSelected && (
                <button
                    onClick={handleOpen}
                    className="absolute flex gap-2 rounded-lg top-[90px] right-6 bg-white p-2 dark:bg-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <PlusSquare />
                    <div>Add Column</div>
                </button>
            )}

            <Dialog size="sm" open={open} handler={handleOpen}>
                <DialogBody>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex items-center p-4">
                        <div className="flex flex-col gap-4 min-w-[100%] m-auto">
                            <p className="text-2xl text-gray-800 font-bold dark:text-white">
                                Create Column
                            </p>
                            <Input
                                name="name"
                                color="indigo"
                                label="Column Name"
                                {...register('name', { required: 'Column Name is required' })}
                                className="dark:text-white text-gray-800"
                            />
                            <Button type="submit" color="indigo" fullWidth>
                                {'Create New Column'}
                            </Button>
                        </div>
                    </form>
                </DialogBody>
            </Dialog>

            <div
                className={`absolute top-[90px] ${isSidebarCollapsed ? 'left-6' : 'left-72'} w-76`}
            >
                <div className="flex gap-3">
                    <Select variant="outlined" label={isProjectSelected ? "Chnage Project" : "Select Project"} onChange={handleProjectSelection}>
                        {projectsList.map((project) => (
                            <Option key={project._id} value={project._id}>
                                {project.name}
                            </Option>
                        ))}
                    </Select>
                    <Select variant="outlined" label="Select Priority" onChange={handlePriorityChange}>
                        <Option value="">
                            All
                        </Option>
                        <Option value="High">
                            High
                        </Option>
                        <Option value="Medium">
                            Medium
                        </Option>
                        <Option value="Low">
                            Low
                        </Option>
                    </Select>
                    <div className="relative flex w-full max-w-[24rem]">
                        <Input
                            type="email"
                            label="Search"
                            value={searchText}
                            onChange={onSearchChange}
                            className="pr-20"
                            containerProps={{
                                className: "min-w-0",
                            }}
                        />
                        <Button
                            size="sm"
                            variant='text'
                            onClick={handleSearch}
                            className="!absolute right-1 top-1 rounded"
                        >
                            <Search size={16} />
                        </Button>
                    </div>
                    <input
                        type='date'
                        name="dueDate"
                        color="indigo"
                        label="Due Date"
                        onChange={handleDateChange}
                        className="w-full h-full bg-transparent text-gray-700 font-sans font-normal outline-none focus:outline-none disabled:bg-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all placeholder:opacity-100 focus:placeholder:opacity-100 text-sm px-3 py-2 rounded-lg border border-blue-gray-200 focus:border-2 focus:border-black dark:text-white"
                    />
                </div>
            </div>

            {isProjectSelected && (
                <div className="pt-20 pl-6">
                    <div className={`flex gap-8`}>
                        <DragDropContext onDragEnd={onDragEnd}>
                            {columnsList.map((column, index) => (
                                <Droppable key={column._id} droppableId={String(index)}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps}>
                                            <Column
                                                key={column._id}
                                                id={column._id}
                                                name={column.name}
                                                tasks={column.tasks}
                                                projectId={filters.selectedProject}
                                                membersList={membersList}
                                                submitNewTask={submitNewTask}
                                                submitNewComment={submitNewComment}
                                                handleTaskDelete={handleTaskDelete}
                                                handleEditTask={handleEditTask}
                                                tasksList={tasksList}
                                            />
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            ))}
                        </DragDropContext>
                    </div>
                </div>
            )}
        </>
    );
};