import React, { useState } from "react";
import {
  Navbar,
  Typography,
  IconButton,
  Button,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { BellIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";

export function TopNavBar() {
  const [showAccount, SetShowAccount] = useState(false);

  return (
    <Navbar
      variant="gradient"
      color="blue-gray"
      className="from-blue-gray-900 max-w-full rounded-none to-blue-gray-800 px-4 py-3 mb-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-y-4 text-white">
        <Typography
          as="a"
          href="#"
          variant="h6"
          className="mr-4 ml-2 cursor-pointer py-1.5"
        >
          Codetru
        </Typography>
        {/* <div className="ml-auto flex gap-1 md:mr-4">
          <IconButton variant="text" color="white">
            <Cog6ToothIcon className="h-4 w-4" />
          </IconButton>
          <IconButton variant="text" color="white">
            <BellIcon className="h-4 w-4" />
          </IconButton>
        </div> */}
        <div className="relative flex w-full gap-2 md:w-max">
          <div className="w-auto">
            <Select 
            color="teal" 
            label="Account"
            value={"1"}
            selected={(element) =>
                element &&
                React.cloneElement(element, {
                  disabled: true,
                  className:
                    "flex items-center opacity-100 px-0 gap-2 pointer-events-none text-white",
                })
              }
            >
              <Option key={'1'} value={'1'}>Rohith Raj</Option>
              <Option key={'2'} value={'2'}>Matt</Option>
              <Option key={'3'} value={'3'}>John</Option>
            </Select>
          </div>
        </div>
      </div>
    </Navbar>
  );
}
