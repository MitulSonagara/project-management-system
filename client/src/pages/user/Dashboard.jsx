import React, { useEffect } from 'react'
import StatisticsCard from '../../components/common/StatisticsCard'
import { CalendarCheck, CalendarRange, ClipboardList, FileCheck2, FileClockIcon, FileCog2, FilePen } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux';
import { getDashboard, getDashboardTable } from '../../redux/Slices/user/dashboardSlice';
import { Card, CardBody, CardHeader, Typography, Avatar, Tooltip, Progress } from '@material-tailwind/react';

export const Dashboard = () => {

  const dispatch = useDispatch()
  const dashboardData = useSelector((state) => state.userDashboard);
  const tableData = useSelector((state) => state.userDashboard.tableData);

  useEffect(() => {
    dispatch(getDashboard());
    dispatch(getDashboardTable());
  }, [dispatch])

  return (
    <div className='p-6'>
      <div className="grid grid-cols-5 gap-4">
        <StatisticsCard title={"Total Tasks"} value={dashboardData.totalTask} icon={<ClipboardList size={36} />} color={"bg-gray-800"} />
        <StatisticsCard title={"Todo Tasks"} value={dashboardData.todoTask} icon={<FilePen size={36} />} color={"bg-blue-600"} />
        <StatisticsCard title={"In Progress Tasks"} value={dashboardData.inProgressTask} icon={<FileCog2 size={36} />} color={"bg-yellow-700"} />
        <StatisticsCard title={"Completed Tasks"} value={dashboardData.completedTask} icon={<FileCheck2 size={36} />} color={"bg-green-600"} />
        <StatisticsCard title={"Overdue Tasks"} value={dashboardData.overDueTask} icon={<FileClockIcon size={36} />} color={"bg-red-600"} />
      </div>

      <div className="grid grid-cols-2 gap-5 mt-5">

        <div className="grid grid-cols-2 gap-5 h-32">
          <StatisticsCard title={"Total Projects"} value={dashboardData.totalProjects} icon={<CalendarRange size={36} />} color={"bg-gray-800"} />
          <StatisticsCard title={"Completed Projects"} value={"0"} icon={<CalendarCheck size={36} />} color={"bg-green-800"} />
        </div>

        <Card className="overflow-hidden border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Projects
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Projects", "Team Members", "Project Manager", "Progress"].map(
                    (el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-2 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-medium uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {tableData.map(
                  (data, key) => {
                    const className = `py-3 px-3 ${key === tableData.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                      }`;
                    return (
                      <tr key={data.name}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {data.name}
                            </Typography>
                          </div>
                        </td>
                        <td className={className}>
                          {data.members.map(({ name, email }, key) => (
                            <Tooltip key={name} content={name + " " + email}>
                              <Avatar
                                src={`https://ui-avatars.com/api/?background=random&name=${name}`}
                                alt={name}
                                size="xs"
                                variant="circular"
                                className={`cursor-pointer border-2 border-white ${key === 0 ? "" : "-ml-2.5"
                                  }`}
                              />
                            </Tooltip>
                          ))}
                        </td>
                        <td className={className}>
                          <Tooltip key={data.manager.name} content={data.manager.name + " " + data.manager.email}>
                            <Avatar
                              src={`https://ui-avatars.com/api/?background=random&name=${data.manager.name}`}
                              size="sm"
                              variant="circular"
                              className={`cursor-pointer border-2 border-white`}
                            />
                          </Tooltip>
                        </td>
                        <td className={className}>
                          <div className="w-10/12">
                            <Typography
                              variant="small"
                              className="mb-1 block text-xs font-medium text-blue-gray-600"
                            >
                              {data.progress}%
                            </Typography>
                            <Progress
                              value={data.progress}
                              variant="gradient"
                              color={data.progress === 100 ? "green" : "blue"}
                              className="h-1"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
