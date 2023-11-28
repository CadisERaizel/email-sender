import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Alert,
  Input,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  CubeTransparentIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from "@heroicons/react/24/outline";
import React from 'react'
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const navigate = useNavigate()
  return (
    <Card className="h-[calc(100vh-66px)] w-full max-w-[5rem] p-4 pl-0 pr-0 justify-center rounded-none shadow-2xl shadow-blue-gray-900/20">
      <List className="min-w-0 gap-8">
        <ListItem className="justify-center" onClick={()=>{
          navigate("/panel")
        }}>
          <InboxIcon className="h-7 w-7" />
        </ListItem>
        <ListItem className="justify-center" onClick={()=>{
          navigate("/")
        }}>
          <FunnelIcon className="h-7 w-7" />
        </ListItem>
        <ListItem className="justify-center">
          <Cog6ToothIcon className="h-7 w-7" />
        </ListItem>
        {/* <ListItem className="justify-center">
          <PowerIcon className="h-7 w-7" />
        </ListItem> */}
      </List>
    </Card>
  );
}

export default SideBar