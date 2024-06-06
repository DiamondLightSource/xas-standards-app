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
import { Switch } from "@mui/material";

import { NavLink } from "react-router-dom";

import ColorModeContext from "../contexts/ColorModeContext";

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

export default function Header() {
  const user = useContext(UserContext);
  console.log(user);
  const loggedIn = user != null;
  console.log(loggedIn);

  const navitems = {
    Home: "/",
    View: "/view",
  };

  Object.keys(navitems).forEach((k) => console.log(k));

  const colorMode = useContext(ColorModeContext);

  return (
    <AppBar style={{ position: "static" }}>
      <Toolbar>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          XAS Standards
        </Typography>
        <Switch onChange={colorMode.toggleColorMode}></Switch>
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
          {loggedIn ? (
            <NavListItem to="/submit" label="Submit" />
          ) : (
            <NavListItem to="/login" label="Login" />
          )}
        </List>
      </Toolbar>
    </AppBar>
  );
}
