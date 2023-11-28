import React from "react";
import { Alert } from "@material-tailwind/react";

export function AlertDismissible(props) {
    const [open, setOpen] = React.useState(props.email.notification_popped == 0);
    const email = props.email

    return (
        <>
            <Alert open={open} color="green" className="absolute right-0 top-0 w-1/2" onClose={() => setOpen(false)}>
                Email with Subject: {email.subject} opened by {email.email}
            </Alert>
        </>
    );
}