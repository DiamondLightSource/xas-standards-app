// import "./Header.css";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

import { Flex } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";

export default function Header() {
  const user = useContext(UserContext);
  console.log(user);
  const loggedIn = user != null;

  return (
    <Flex
      flexDir="row"
      width="100%"
      justify-content="space-between"
      align-items="center"
    >
      <Heading alignSelf="stretch">XAS Standards</Heading>
      <Flex flexDir="row" flex={1}>
        <Link
          as={NavLink}
          to="/dashboard"
          p={2}
          _activeLink={{ fontWeight: "bold" }}
        ></Link>
        <nav>
          <NavLink
            to="/"
            style={({ isActive }) => ({
              color: isActive ? "#CCCCCC" : "gray",
            })}
          >
            <div className="headernavitem"> Home </div>
          </NavLink>
          {loggedIn ? null : (
            <NavLink
              to="/login"
              style={({ isActive }) => ({
                color: isActive ? "#CCCCCC" : "gray",
              })}
            >
              <div className="headernavitem"> Log In </div>
            </NavLink>
          )}
          <NavLink
            to="/view"
            style={({ isActive }) => ({
              color: isActive ? "#CCCCCC" : "gray",
            })}
          >
            <div className="headernavitem"> View </div>
          </NavLink>
          {loggedIn ? (
            <NavLink
              to="/submit"
              style={({ isActive }) => ({
                color: isActive ? "#CCCCCC" : "gray",
              })}
            >
              <div className="headernavitem"> Submit </div>
            </NavLink>
          ) : null}
          ;
          {/* <NavLink
            to="/review"
            style={({ isActive }) => ({ color: isActive ? "#CCCCCC" : "gray" })}
          >
            <div className="headernavitem"> Review </div>
          </NavLink>
          <NavLink
            to="/submit3"
            style={({ isActive }) => ({ color: isActive ? "#CCCCCC" : "gray" })}
          >
            <div className="headernavitem"> Log in </div>
          </NavLink> */}
        </nav>
      </Flex>
    </Flex>
  );
}
