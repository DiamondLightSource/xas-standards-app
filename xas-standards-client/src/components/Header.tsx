import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

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

export default function HeaderMui() {
  const user = useContext(UserContext);
  console.log(user);
  const loggedIn = user != null;

  const navitems = {
    Home: "/",
    Login: "/login",
    View: "/view",
    Submit: "/submit",
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
                    fontWeight: 600,
                    backgroundColor: (theme) => theme.palette.action.focus,
                  },
                }}
              >
                <ListItemText primary={key} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Toolbar>
    </AppBar>
  );
}
