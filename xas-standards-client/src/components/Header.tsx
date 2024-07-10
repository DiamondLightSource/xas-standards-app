import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

import ListItemButton from "@mui/material/ListItemButton";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { Checkbox, IconButton, Menu, MenuItem } from "@mui/material";

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
  const loggedIn = user != null;
  const admin = user != null && user.admin;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const navitems = {
    Home: "/",
    View: "/view",
    Terms: "/terms",
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const signOut = () => {
    handleClose();
    console.log("Sign out");
    navigate("/oauth2/sign_out");
    window.location.reload();
  };

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
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <UserIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={signOut}>Sign out</MenuItem>
              </Menu>

              <Typography>{user.identifier}</Typography>
            </Stack>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
