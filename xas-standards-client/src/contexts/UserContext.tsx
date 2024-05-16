import { createContext } from "react";
import { User } from "../models";
import useUser from "../hooks/useUser";

const UserContext = createContext<User | null>(null);

function UserProvider(props: { children: React.ReactNode }) {
  const { children } = props;
  const user = useUser();

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export { UserContext, UserProvider };
