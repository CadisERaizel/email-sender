// Card.js
import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { EnvelopeIcon, GlobeAltIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Avatar,
    IconButton,
    Typography,
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";

const Card = (props) => {
    const [activeTab, setActiveTab] = useState("html");
    const data = [
        {
            label: "Conversation",
            value: "history",
            desc: `It really matters and then like it really doesn't matter.
      What matters is the people who are sparked by it. And the people 
      who are like offended by it, it doesn't matter.`,
        },
        {
            label: "Other",
            value: "react",
            desc: `Because it's about motivating the doers. Because I'm here
      to follow my dreams and inspire other people to follow their dreams, too.`,
        }
    ];
    const [open, setOpen] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const handleOpen = () => setOpen((cur) => !cur);
    const handleIsFavorite = () => setIsFavorite((cur) => !cur);
    return (
        <>
            <Draggable key={props.task.id} draggableId={props.task.id} index={props.index}>
                {(provided, snapshot) => (
                    <div className={`border border-solid border-lightgrey p-4 mb-8 rounded-m ${snapshot.isDragging ? 'bg-[#e0ffe0]' : 'bg-white'}`}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        onDoubleClick={handleOpen}
                    >
                        <div className='flex flex-col'>
                            <div className='flex justify-between items-center pb-4'>
                                <div className='flex justify-center items-center bg-blue-600 text-white text-lg rounded-full w-[50px] h-[50px]'>RE</div>
                                <div className='px-2 h-7 bg-[#F4ECDB] items-center justify-center rounded-lg'><span className='text-[#B47E5A] text-xs font-[600]'>Need to Contact</span></div>
                            </div>
                            <h6 className='w-full text-sm pb-2 font-semibold'>Ralph Edwards</h6>
                            <hr className='pb-2 text-lg' />
                            <div className='flex flex-col gap-1'>
                                <div className='flex items-center'>
                                    <EnvelopeIcon strokeWidth={2} className="h-3 w-3 rounded-full mr-2" /><span className='text-sm'>ralph@ibm.com</span>

                                </div>
                                <div className='flex items-center'>
                                    <GlobeAltIcon strokeWidth={2} className="h-3 w-3 rounded-full mr-2" /><span className='text-sm'>IBM</span>
                                </div>
                                <div className='flex items-center'>
                                    <PencilSquareIcon strokeWidth={2} className="h-3 w-3 rounded-full mr-2" /><span className='text-sm'>C#, Java</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Draggable>
            <Dialog className='mt-16 border-none' size="xl" open={open} handler={handleOpen}>
                <DialogBody className='mt-5 border-none'>
                    <div className='px-8 flex flex-col'>
                        <div className='flex w-full justify-between items-center pb-4'>
                            <div className='flex gap-4 items-center '>
                                <div className='flex justify-center items-center bg-blue-600 text-white text-lg rounded-full w-[50px] h-[50px]'>RE</div>
                                <div className='flex flex-col gap-1'>
                                    <h6 className='w-full text-sm font-semibold'>Ralph Edwards</h6>
                                    <div className='flex items-center'>
                                        <EnvelopeIcon strokeWidth={2} className="h-3 w-3 rounded-full mr-2" /><span className='text-sm'>ralph@ibm.com</span>

                                    </div>
                                    <div className='flex items-center'>
                                        <GlobeAltIcon strokeWidth={2} className="h-3 w-3 rounded-full mr-2" /><span className='text-sm'>IBM</span>
                                    </div>
                                    <div className='flex items-center'>
                                        <PencilSquareIcon strokeWidth={2} className="h-3 w-3 rounded-full mr-2" /><span className='text-sm'>C#, Java</span>
                                    </div>
                                </div>
                            </div>
                            <div className='px-2 h-7 bg-[#F4ECDB] items-center justify-center rounded-lg'><span className='text-[#B47E5A] text-xs font-[600]'>Need to Contact</span></div>
                        </div>
                        <hr className='text-lg font-bold border-t-2' />
                        <div className='flex pt-8'>
                            <div className='w-3/4 h-[400px] border-r'>
                                <Tabs value={activeTab}>
                                    <div className="grid grid-cols-4 gap-1">
                                        <div>
                                            <TabsHeader
                                                className="rounded-none border-b border-blue-gray-50 bg-transparent p-0 "
                                                indicatorProps={{
                                                    className:
                                                        "bg-transparent border-b-2 border-blue-300 shadow-none rounded-none",
                                                }}
                                            >
                                                {data.map(({ label, value }) => (
                                                    <Tab
                                                        key={value}
                                                        value={value}
                                                        onClick={() => setActiveTab(value)}
                                                        className={activeTab === value ? "text-sm text-[#607d8b]" : "text-sm"}
                                                    >
                                                        {label}
                                                    </Tab>
                                                ))}
                                            </TabsHeader>
                                        </div>
                                    </div>
                                    <TabsBody>
                                        {data.map(({ value, desc }) => (
                                            <TabPanel key={value} value={value}>
                                                {desc}
                                            </TabPanel>
                                        ))}
                                    </TabsBody>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </DialogBody>
            </Dialog>
        </>
    );
};

export default Card;
