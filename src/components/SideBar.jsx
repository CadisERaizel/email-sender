import { Card, List, ListItem } from "@material-tailwind/react";
import {
  Cog6ToothIcon,
  InboxIcon,
  BookOpenIcon,
} from "@heroicons/react/24/solid";
import { RectangleGroupIcon, FunnelIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useNavigate } from "react-router-dom";
import { HashRouter as Router, Route, Link } from "react-router-dom";

const SideBar = () => {
  // const navigate = useNavigate()
  return (
    <Card className="h-full w-full max-w-[5rem] p-4 pl-0 pr-0 justify-center rounded-none shadow-2xl shadow-blue-gray-900/20">
      <List className="min-w-0 gap-8 text-[#8bc34a]">
        <Link to="/inbox">
          <ListItem className="justify-center">
            <InboxIcon className="h-7 w-7 " />
          </ListItem>
        </Link>
        <Link to="/">
          <ListItem className="justify-center">
            <FunnelIcon className="h-7 w-7" />
          </ListItem>
        </Link>
        <Link to="/contacts">
          <ListItem className="justify-center">
            <BookOpenIcon className="h-7 w-7" />
          </ListItem>
        </Link>
        <Link to="/board">
          <ListItem className="justify-center">
            <RectangleGroupIcon className="h-7 w-7" />
          </ListItem>
        </Link>
      </List>
    </Card>
  );
};

export default SideBar;
