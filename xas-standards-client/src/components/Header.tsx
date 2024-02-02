import "./Header.css";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <div className="header">
      <h1 className="headerstart">XAS Standards</h1>
      <div className="headerbuttons">
        <nav>
          <NavLink
            to="/"
            style={({ isActive }) => ({
              color: isActive ? "#CCCCCC" : "gray",
            })}
          >
            <div className="headernavitem"> View </div>
          </NavLink>
          <NavLink
            to="/submit"
            style={({ isActive }) => ({ color: isActive ? "#CCCCCC" : "gray" })}
          >
            <div className="headernavitem"> Submit </div>
          </NavLink>
          <NavLink
            to="/submit2"
            style={({ isActive }) => ({ color: isActive ? "#CCCCCC" : "gray" })}
          >
            <div className="headernavitem"> Review </div>
          </NavLink>
          <NavLink
            to="/submit3"
            style={({ isActive }) => ({ color: isActive ? "#CCCCCC" : "gray" })}
          >
            <div className="headernavitem"> Log in </div>
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
