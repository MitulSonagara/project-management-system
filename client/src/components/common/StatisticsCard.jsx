import { Card, CardBody, CardHeader, Typography } from '@material-tailwind/react'
import React from 'react'

const StatisticsCard = ({ icon, title, value ,color }) => {
    return (
        <Card className="border border-blue-gray-100 shadow-sm p-0">
            <CardBody className="p-4 text-center items-center">
                <div className="flex items-center justify-evenly">
                    <div className={`${color} p-2 rounded-lg text-white shadow-lg`}>

                    {icon}
                    </div>
                    <div>
                        <Typography variant="small" className="font-normal text-blue-gray-600">
                            {title}
                        </Typography>
                        <Typography variant="h1" color="blue-gray">
                            {value}
                        </Typography>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}

export default StatisticsCard