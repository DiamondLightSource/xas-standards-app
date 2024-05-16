import "./Header.css";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export default function Header() {
  const user = useContext(UserContext);
  console.log(user);
  const loggedIn = user != null;

  return (
    <div className="header">
      <h2 className="headerstart">XAS Standards</h2>
      <div className="headerbuttons">
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
      </div>
    </div>
  );
}
