import React, { useState } from 'react'
import { fetchActivityLogs } from '../../redux/Slices/activitySlice'
import { Button, Dialog, Timeline, TimelineConnector, TimelineHeader, TimelineIcon, TimelineItem, Typography } from '@material-tailwind/react'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowRightLeft, CirclePlus, SquarePen, Trash2 } from 'lucide-react'

const ActivityLog = ({ projectId }) => {
    const activityList = useSelector((state) => state.activityLogSlice.activityList)

    const [open, setOpen] = useState(false);

    const renderSwitch = (param) => {
        switch (param) {
            case "Created":
                return <CirclePlus className="h-6 w-6 text-green-400" />
            case "Updated":
                return <SquarePen className="h-6 w-6 text-blue-400" />
            case "Deleted":
                return <Trash2 className="h-6 w-6 text-red-400" />
            case "Moved":
                return <ArrowRightLeft className="h-6 w-6 text-black" />
        }
    }
    const handleOpen = () => {
        dispatch(fetchActivityLogs(projectId))
        setOpen(!open)
    };

    const dispatch = useDispatch();
    return (
        <div>
            <Button onClick={handleOpen}>Activity Logs</Button>
            <Dialog open={open} handler={handleOpen} className='p-4 h-3/4 overflow-auto'>
                <Timeline>
                    {activityList.map((activity,index) => (
                        <TimelineItem className="h-24" key={index}>
                            <TimelineConnector className="!w-[78px]" />
                            <TimelineHeader className="relative rounded-xl border border-blue-gray-50 bg-white py-1 pl-4 pr-8 shadow-lg shadow-blue-gray-900/5">
                                <TimelineIcon className="p-3" variant="ghost">
                                    {renderSwitch(activity.action)}
                                </TimelineIcon>
                                <div className="flex flex-col gap-1">

                                    <Typography variant="h6" color="blue-gray">
                                        {activity.details}
                                    </Typography>

                                    <div className='flex gap-10'>
                                        <Typography variant="small" color="gray" className="font-normal">
                                            User : {activity.userId.name}
                                        </Typography>
                                        <Typography variant="small" color="gray" className="font-normal">
                                            {new Date(activity.createdAt).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </Typography>
                                    </div>
                                </div>
                            </TimelineHeader>
                        </TimelineItem>
                    ))}
                </Timeline>
            </Dialog>
        </div>
    )
}
export default ActivityLog