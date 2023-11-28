import React, { useEffect } from 'react'
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
    Card,
    Button
} from "@material-tailwind/react";
import { useCampaignStore } from '../hooks/Campaigns';
import { useEmailStore } from '../hooks/EmailStore';
import { PlusIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie } from 'recharts';
import ListComponent from '../components/ListComponent';
import { AlertDismissible } from '../components/Alert';




const CampaignsScreen = () => {

    const Bardata = [
        {
            name: '01/11',
            sent: 4000,
            opened: 2400,
            amt: 2400,
        },
        {
            name: '02/11',
            sent: 3000,
            opened: 1398,
            amt: 2210,
        },
        {
            name: '03/11',
            sent: 2000,
            opened: 1500,
            amt: 2290,
        },
        {
            name: '04/11',
            sent: 2780,
            opened: 2000,
            amt: 2000,
        },
        {
            name: '05/11',
            sent: 1890,
            opened: 900,
            amt: 2181,
        },
        {
            name: '06/11',
            sent: 2390,
            opened: 1248,
            amt: 2500,
        },
        {
            name: '07/11',
            sent: 3490,
            opened: 1935,
            amt: 2100,
        },
        {
            name: '08/11',
            sent: 0,
            opened: 0,
            amt: 0,
        },
        {
            name: '09/11',
            sent: 0,
            opened: 0,
            amt: 0,
        },
        {
            name: '10/11',
            sent: 0,
            opened: 0,
            amt: 0,
        },
        {
            name: '11/11',
            sent: 0,
            opened: 0,
            amt: 0,
        },
        {
            name: '12/11',
            sent: 0,
            opened: 0,
            amt: 0,
        },
        {
            name: '13/11',
            sent: 0,
            opened: 0,
            amt: 0,
        },
    ];

    const PieChartData = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const emails = useEmailStore()
    const campaigns = useCampaignStore()

    const data = [
        {
            label: "Last Campaigns",
            value: "campaign",
            Component: ListComponent,
            isCampaigns: true
        },
        {
            label: "Mail Opened",
            value: "opened",
            Component: ListComponent,
            isCampaigns: false
        }
    ];

    useEffect(() => {
        campaigns.fetchList()
        emails.fetchOpenedList()
    }, [])
    return (
        <div className='flex'>
            <div className='w-1/4'>
                <Tabs value="campaign" className="rounded-b-2xl">
                    <div className="">
                        <div>
                            <TabsHeader className='p-0'>
                                {data.map(({ label, value }) => (
                                    <Tab key={value} value={value}>
                                        {label}
                                    </Tab>
                                ))}
                            </TabsHeader>
                        </div>
                    </div>
                    <TabsBody>
                        {data.map(({ value, Component, isCampaigns }) => (
                            <TabPanel className='p-0 rounded-xl shadow-2xl shadow-blue-gray-900/20' key={value} value={value}>
                                <Card className="h-[calc(100vh-200px)] no-scrollbar rounded-sm overflow-scroll shadow-2xl shadow-blue-gray-900/20">
                                    <Component campaigns={campaigns} isCampaigns={isCampaigns} emails={emails} />
                                </Card>
                            </TabPanel>
                        ))}
                    </TabsBody>
                </Tabs>
            </div>
            <div className='w-3/4 h-[calc(100vh-200px)]'>
                <div className='w-full h-11 flex flex-row-reverse'>
                    <div className='flex gap-4'>
                        <Button size='sm' color="blue" className="flex items-center gap-3" variant="filled">Quick Send
                            <PaperAirplaneIcon className='h-5 w-5' /></Button>
                        <Button size='sm' color="blue" className="flex items-center gap-3" variant="outlined">Create a Campaign
                            <PlusIcon className='h-6 w-6' />
                        </Button>
                    </div>
                </div>
                <div>
                    <div className='w-full p-4 flex justify-between gap-4'>
                        <Card className='w-6/12 items-center'>
                            <PieChart width={400} height={200}>
                                <Pie
                                    data={PieChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {PieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </Card>
                        <Card className='w-6/12 items-center'>
                            <PieChart width={400} height={200}>
                                <Pie
                                    data={PieChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {PieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </Card>
                    </div>
                </div>
                <div className='w-full p-4'>
                    <Card className='w-full'>
                        <BarChart
                            width={900}
                            height={300}
                            data={Bardata}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar barSize={10} dataKey="opened" stackId="a" fill="#8884d8" />
                            <Bar barSize={10} dataKey="sent" stackId="a" fill="#82ca9d" />
                        </BarChart>
                    </Card>
                </div>
            </div>
            {emails.emailsOpenedList.map((email) => (
                <AlertDismissible email={email} />
            ))

            }
        </div>
    )
}

export default CampaignsScreen