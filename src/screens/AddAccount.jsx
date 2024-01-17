import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { addAssociateAccount } from "../apis/apis";

const AddAccount = () => {
  const { user_id } = useParams();

  useEffect(() => {
    const addAccount = async () => {
      if (user_id === undefined) {
        window.location.href = "http://localhost:5555/add-account";
      } else {
        const response = await addAssociateAccount(user_id)
        if (response.status === 200) {
            window.close()
        }
      }
    };
    addAccount()
  }, []);
  return <div>AddAccount</div>;
};

export default AddAccount;
