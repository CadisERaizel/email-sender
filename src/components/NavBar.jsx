import React, { useEffect, useState } from "react";
import {
  Navbar,
  Typography,
  Button,
  Select,
  Option,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Avatar,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  UserPlusIcon,
  LifebuoyIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { API_URL } from "../config/defaults";

const API_BASE_URL = API_URL;

export function TopNavBar(props) {
  const [userAccounts, setUserAccounts] = useState([]);
  const setSelectedUser = props.setSelectedUser;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/list-users/`);
        setUserAccounts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <Navbar
      variant="filled"
      color="light-green"
      className=" max-w-full rounded-none px-4 py-3 m-0"
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
        <div>
          <ProfileMenu />
        </div>
      </div>
    </Navbar>
  );
}


const ProfileMenu = () => {

  const handleLogout = () => {
    closeMenu()
    window.location.href = "http://localhost:5555/logout";
  };

  const handleAddAccount = async () => {
    closeMenu()
    window.open(
      `//localhost:5555/add-account/`,
      "_blank",
      "width=550,height=600"
    );
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
 
  const closeMenu = () => setIsMenuOpen(false);

  const profileMenuItems = [
    {
      label: "Help",
      icon: LifebuoyIcon,
      action: () => {closeMenu()}
    },
    {
      label: "Add Account",
      icon: UserPlusIcon,
      action: handleAddAccount
    },
    {
      label: "Sign Out",
      icon: PowerIcon,
      action: handleLogout
    },
  ];

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="tania andrew"
            className="border border-grey-100 p-0.5"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            color="white"
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {profileMenuItems.map(({ label, icon, action }, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          return (
            <MenuItem
              key={label}
              onClick={() => action()}
              className={`flex items-center gap-2 rounded ${
                isLastItem
                  ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                  : ""
              }`}
            >
              {React.createElement(icon, {
                className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                strokeWidth: 2,
              })}
              <Typography
                as="span"
                variant="small"
                className="font-normal"
                color={isLastItem ? "red" : "inherit"}
              >
                {label}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );

}