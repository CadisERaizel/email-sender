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
  Input,
} from "@material-tailwind/react";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { ReactComponent as Loader } from "../assets/svgs/loader.svg"
import { ReactComponent as Tick } from "../assets/svgs/tick.svg"

const API_BASE_URL = 'http://localhost:55555';


export function TopNavBar(props) {
  const [userAccounts, setUserAccounts] = useState([]);
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const [addingUser, setAddingUser] = useState(false)
  const [addedUser, setAddedUser] = useState(false)
  const setSelectedUser = props.setSelectedUser
  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  })


  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value })
  }

  const handleOpen = () => setOpen((cur) => !cur);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/list-users/`);
      setUserAccounts(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const addUser = async (user) => {
    try {
      var response = await axios.post(`${API_BASE_URL}/add-user/`, user);
      return response
    } catch (error) {
      return error
    }
  };

  const handleAddAccount = async () => {
    setAddingUser(true)
    if (!Object.values(newUser).some(value => value === '')) {
      var response = await addUser(newUser)
      fetchUsers()
      console.log(newUser)
      console.log(response)
      if (response.status === 200) {
        setAddingUser(false)
        setAddedUser(true)
        setTimeout(() => {
          setOpen((cur) => !cur)
          setAddedUser(false)
          setAddingUser(false)
          setNewUser({
            first_name: '',
            last_name: '',
            email: '',
            password: ''
          })
        }, 1500)
      }
    } else {
      console.log("not empty")
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <Navbar
      // variant="gradient"
      // color="grey"
      className=" max-w-full rounded-none px-4 py-3 m-0 bg-[#233d4d]"
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
        <div className="relative flex w-full gap-2 md:w-max">
          <div className="w-auto">
            <Select
              color="teal"
              label="Account"
              selected={(element) =>
                element &&
                React.cloneElement(element, {
                  disabled: true,
                  className:
                    "flex items-center opacity-100 px-0 gap-2 pointer-events-none text-white",
                })
              }
              onChange={(e)=>{setSelectedUser(e)}}
            >
              {userAccounts.map((user) => (
                <Option key={user.id.toString()} value={user.id.toString()}>
                  {user.full_name}
                </Option>
              ))}
              {/* <Option key={'1'} value={'1'}>Rohith Raj</Option>
              <Option key={'2'} value={'2'}>Matt</Option>
              <Option key={'3'} value={'3'}>John</Option> */}
            </Select>
          </div>
          <Button
            className="flex items-center gap-1 bg-blue-gray-400"
            size="sm"
            onClick={handleOpen}
          >Add Account
            {/* <PlusIcon strokeWidth={2} className="h-5 w-5 rounded-full bg-light-blue-500" /> */}
          </Button>
        </div>
      </div>
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              New Account
            </Typography>
            <Typography
              className="font-normal"
              variant="paragraph"
              color="gray"
            >
              Enter your email and password.
            </Typography>
            <Typography className="-mb-2" variant="h6">
              Your First Name
            </Typography>
            <Input label="First Name" size="lg" name="first_name" value={newUser.first_name} onChange={handleChange} />
            <Typography className="-mb-2" variant="h6">
              Your Last Name
            </Typography>
            <Input label="Last Name" size="lg" name="last_name" value={newUser.last_name} onChange={handleChange} />
            <Typography className="-mb-2" variant="h6">
              Your Email
            </Typography>
            <Input label="Email" size="lg" name="email" value={newUser.email} onChange={handleChange} />
            <Typography className="-mb-2" variant="h6">
              Your Password
            </Typography>
            <div className="relative flex w-full max-w-[24rem]">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                value={newUser.password}
                onChange={handleChange}
                className="pr-20"
                containerProps={{
                  className: "min-w-0",
                }}
              />
              <Button
                size="sm"
                color={newUser.password ? "blue" : "blue-gray"}
                disabled={!newUser.password}
                className="!absolute right-1 top-1 rounded"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeIcon strokeWidth={2} className="h-4 w-4" /> : <EyeSlashIcon strokeWidth={2} className="h-4 w-4" />}
              </Button>
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button className={`flex items-center gap-1 justify-center ${addedUser ? "button-background" : ""}`} disabled={addedUser ? true : false} color="" onClick={handleAddAccount} fullWidth>
              {addingUser ? (<><Loader />Adding...</>) : addedUser ? (<><Tick fill="white" className="w-[20px] h-[20px] -mt-[1px]" />Success</>) : "Add Account"}
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </Navbar>
  );
}
