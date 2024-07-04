import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

import ListItemButton from "@mui/material/ListItemButton";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { Checkbox } from "@mui/material";

import { NavLink } from "react-router-dom";

import DiamondIcon from "./DiamondIcon";

import UserIcon from "./UserIcon";
import LightModeIcon from "./LightModeIcon";
import DarkModeIcon from "./DarkModeIcon";

function NavListItem(props: { to: string; label: string }) {
  const to = props.to;
  const label = props.label;
  return (
    <ListItem key={label}>
      <ListItemButton
        component={NavLink}
        to={to}
        sx={{
          "&.active": {
            fontWeight: 800,
            color: (theme) => theme.palette.text.secondary,
          },
        }}
      >
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );
}

export default function Header(props: {
  colorMode: string;
  toggleColorMode: () => void;
}) {
  const user = useContext(UserContext);
  console.log(user);
  const loggedIn = user != null;
  const admin = user != null && user.admin;
  console.log(loggedIn);

  const navitems = {
    Home: "/",
    View: "/view",
  };

  Object.keys(navitems).forEach((k) => console.log(k));

  return (
    <AppBar style={{ position: "static" }}>
      <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Stack direction="row" alignItems={"center"} spacing={2}>
          <DiamondIcon />
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            XAS Standards
          </Typography>
          <List component={Stack} direction="row">
            {Object.entries(navitems).map(([key, value]) => (
              <ListItem key={key}>
                <ListItemButton
                  component={NavLink}
                  to={value}
                  sx={{
                    "&.active": {
                      color: (theme) => theme.palette.text.secondary,
                    },
                  }}
                >
                  <ListItemText primary={key} />
                </ListItemButton>
              </ListItem>
            ))}
            {loggedIn && <NavListItem to="/submit" label="Submit" />}
            {admin && <NavListItem to="/review" label="Review" />}
          </List>
        </Stack>
        <Stack direction="row" alignItems={"center"}>
          <Checkbox
            icon={<LightModeIcon />}
            checkedIcon={<DarkModeIcon />}
            checked={props.colorMode === "dark"}
            onChange={props.toggleColorMode}
          ></Checkbox>
          {!loggedIn ? (
            <NavListItem to="/login" label="Login" />
          ) : (
            <Stack alignItems={"flex-end"}>
              <UserIcon />
              <Typography>{user.identifier}</Typography>
            </Stack>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
