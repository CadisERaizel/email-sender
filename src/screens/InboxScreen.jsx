import React, { useEffect, useState } from 'react'
import { API_URL } from "../config/defaults";

const InboxScreen = () => {
    const [mails, setMails] = useState()
    // useEffect(() => {
    //     const fetchMails = async () => {
    //         try {
    //             var response = await axios.post(`${API_BASE_URL}/inbox/`, user);
    //             return response
    //         } catch (error) {
    //             return error
    //         }
    //     }

    // }, [])
    return (
        <div>InboxScreen</div>
    )
}

export default InboxScreen