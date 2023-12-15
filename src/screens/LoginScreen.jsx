import React from 'react'
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../config/msalConfig';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as MSLOGO } from '../assets/svgs/ms-logo.svg'

const LoginScreen = () => {
    const navigate = useNavigate()
    const { instance } = useMsal();

    const handleLogin = () => {
        instance.loginPopup(loginRequest).catch(e => {
            console.log(e);
        });
        navigate('/')

    }
    return (
        <div className='flex justify-center h-[100vh] items-center bg-gradient-to-r from-main-red from-0% to-main-yellow to-74%'>
            <button className='w-[215px] bg-white h-[41px] flex border border-[#8C8C8C] justify-center items-center' onClick={handleLogin}>
                <span className='px-[12px]'><MSLOGO /></span><span className='font-segoe font-semibold text-[15px] text-[#5E5E5E]'>Sign in with Microsoft</span>
            </button>
        </div>
    )
}

export default LoginScreen