import React from "react";

const Drawer = ({
  children,
  openRight,
  setOpenRight, 
}) => {
  return (
    <div
      className={
        " fixed overflow-hidden z-10 bg-transparent inset-0 transform ease-in-out " +
        (openRight
          ? " transition-opacity opacity-100 duration-500 translate-x-0  "
          : " transition-all delay-300 opacity-0 translate-x-full  ")
      }
    >
      <section
        className={
          " w-screen max-w-lg right-0 absolute bg-white h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform  " +
          (openRight ? " translate-x-0 " : " translate-x-full ")
        }
      >
        <article className="relative w-screen max-w-lg flex flex-col overflow-y-scroll h-full">
          {children}
        </article>
      </section>
      <section
        className=" w-screen h-full cursor-pointer "
        onClick={() => {
          setOpenRight(false);
        }}
      ></section>
    </div>
  );
};

export default Drawer;
