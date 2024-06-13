import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { User } from "../models";

const user_url = "/api/user";

function useUser(): User | null {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    axios
      .get(user_url)
      .then((res: AxiosResponse) => {
        // console.log(res.status);
        setCurrentUser({ identifier: res.data.user, admin: res.data.admin});
      })
      .catch((error) => {
        console.log(error.response);
        setCurrentUser(null);
      });
  }, []);

  return currentUser;
}

export default useUser;
