import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

// MUI Core
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

// MUI Icons
import HomeIcon from "@material-ui/icons/Home";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ChatIcon from "@material-ui/icons/Chat";

import { useAuth } from "../libs/use-auth.js";

const useStyles = makeStyles((theme) => ({
  root: {
    // flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: 250,
  },
  buttons: {
    "& > *": {
      margin: theme.spacing(1),
      textDecoration: "inherit",
    },
  },
}));

export default function MenuAppBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { user, signout } = useAuth();
  const history = useHistory();

  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleMenu = () => {
    setDrawerOpen(!drawerOpen);
  };

  const logout = async () => {
    handleClose();
    await signout();
    history.replace("/");
  };

  return (
    <div className={classes.root}>
      <AppBar position="" color="default">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={toggleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Lets Watch!
          </Typography>
          {user ? (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                size="medium"
              >
                <AccountCircle style={{ fontSize: 40 }} />
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
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={logout}>Log out</MenuItem>
              </Menu>
            </div>
          ) : (
            <div className={classes.buttons}>
              <Link to="/signup">
                <Button variant="contained">Sign up</Button>
              </Link>
              <Link to="/login">
                <Button variant="contained" color="primary">
                  Log in
                </Button>
              </Link>
            </div>
          )}
        </Toolbar>
      </AppBar>
      {/* A second toolbar component to push main content down because of fixed appbar */}
      {/* <Toolbar /> */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleMenu}>
        <List className={classes.list}>
          {/* Not sure if link should be at this level but it works! */}
          <Link to="/">
            <ListItem button onClick={toggleMenu}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
          </Link>
          <Link to="/chat">
            <ListItem button onClick={toggleMenu}>
              <ListItemIcon>
                <ChatIcon />
              </ListItemIcon>
              <ListItemText primary="Chat" />
            </ListItem>
          </Link>
        </List>
      </Drawer>
    </div>
  );
}
