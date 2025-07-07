import { Button, Dialog, DialogBody, Textarea } from '@material-tailwind/react';
import { MessageSquareText } from 'lucide-react';
import React, { useState } from 'react'
import { useForm } from "react-hook-form";

const CommentsModal = ({comments, taskId,submitNewComment, commenterName, commenterId}) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);
    const totalComments = comments.length;
    const { register, handleSubmit, reset } = useForm();
    const onSubmit = (data) => {
        const formData = {
            ...data,
            commenterId,
            commenterName,
        }
        submitNewComment(formData)
        reset()
        handleOpen()
    }
    return (
        <div>
            <div className="flex">
                <button onClick={handleOpen} className='text-gray-700 dark:text-white'>
                    <MessageSquareText className="h-5 w-5" />
                </button>
                <p className="text-xs ml-0.5">{totalComments}</p>
            </div>
            <Dialog size="sm" open={open} handler={handleOpen}>
                <DialogBody className="h-[40rem] overflow-scroll">
                    <section class="bg-white antialiased overflow-auto">
                        <div class="max-w-2xl mx-auto px-4">
                            <div class="flex justify-between items-center mb-6">
                                <h2 class="text-lg lg:text-2xl font-bold text-gray-900 ">Comments</h2>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="mb-3">
                                <input {...register("taskId")} value={taskId} hidden />
                                <Textarea
                                    label="Write your comment"
                                    {...register("content", {
                                        required: "Please write the comment",
                                    })}
                                    className="dark:text-white text-gray-800"
                                />
                                <Button type="submit">
                                    Post comment
                                </Button>
                            </form>
                            {comments && comments.map((comment,index) => (
                                <article key={index} class="p-2 text-base bg-white rounded-lg ">
                                    <footer class="flex justify-between items-center mb-2">
                                        <div class="flex items-center">
                                            <p class="inline-flex items-center mr-3 text-sm text-gray-900  font-semibold">
                                                <img
                                                    class="mr-2 w-6 h-6 rounded-full"
                                                    src={`https://ui-avatars.com/api/?background=random&name=${comment.commenterName}`}
                                                    alt="Michael Gough" />{comment.commenterName}</p>
                                            <p class="text-sm text-gray-600 "><time pubdate datetime="2022-02-08"
                                                title="February 8th, 2022">{comment.createdAt}</time></p>
                                        </div>

                                    </footer>
                                    <p class="text-gray-500 ">{comment.content}</p>

                                </article>
                            ))}
                        </div>
                    </section>

                </DialogBody></Dialog>
        </div>
    )
}

export default CommentsModal