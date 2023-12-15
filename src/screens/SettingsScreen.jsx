import React, { useState } from 'react'
import { Input, Checkbox } from "@material-tailwind/react";

const SettingsScreen = (props) => {
    const interval = props.interval
    const setInterval =  props.setInterval
    const handleChange = (e) =>{
        setInterval(e.target.value)
    }
    const setVerify = props.setVerify
    return (
        <div className='flex flex-col'>
            <div className='half-a-border-on-top mb-6 border-gradient p-2 border-b-2'><h1>General Settings</h1></div>
            <div className='w-1/2 flex gap-1 justify-center text-center items-center'>
                <div className=''><h4>Email Send : </h4></div>
                <div className='inline-flex items-center'><Input type="number" step="0.01" label="Interval" value={interval} onChange={handleChange}/>{" "}sec</div>
            </div>
            <div className='w-1/2 flex gap-1 justify-center text-center items-center'>
            <Checkbox color="blue" defaultChecked label="Verify email before send" ripple={false} onChange={(e)=>{setVerify(e.target.checked)}}/>
            </div>
        </div>
    )
}

export default SettingsScreen