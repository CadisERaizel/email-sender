import React, { useState } from "react";
import { Alert } from "@material-tailwind/react";

export function AlertDismissible(props) {
  const [open, setOpen] = useState(props.email.notification_popped == 0);
  const email = props.email;

  return (
    <>
      <Alert
        open={open}
        color="green"
        className="absolute right-0 top-0 w-1/2"
        onClose={() => setOpen(false)}
      >
        Email with Subject: {email.subject} opened by {email.email}
      </Alert>
    </>
  );
}

export function CustomAlert({ open, setOpen }) {


  return (
    <>
      <Alert
        open={open.state}
        color="green"
        className="absolute bottom-0"
        onClose={() => {
            setOpen({
                state:false,
                message:''
            })
        }}
      >
        {open.message}
      </Alert>
    </>
  );
}
