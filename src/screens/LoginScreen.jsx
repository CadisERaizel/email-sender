import React from "react";
import { ReactComponent as MSLOGO } from "../assets/svgs/ms-logo.svg";

const LoginScreen = () => {
    const handleLogin = () =>{
        window.location.href="http://localhost:5555/login"
    }
  return (
    <div className="flex justify-center h-[100vh] items-center bg-gradient-to-r from-main-red from-0% to-main-yellow to-74%">
      <button
        className="w-[215px] bg-white h-[41px] flex border border-[#8C8C8C] justify-center items-center"
        onClick={handleLogin}
      >
        <span className="px-[12px]">
          <MSLOGO />
        </span>
        <span className="font-segoe font-semibold text-[15px] text-[#5E5E5E]">
          Sign in with Microsoft
        </span>
      </button>
    </div>
  );
};

export default LoginScreen;
