import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import makeStyles from '@mui/styles/makeStyles';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";

// MUI Icons
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ChatIcon from "@mui/icons-material/Chat";

import { useAuth } from "../libs/use-auth.js";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: 250,
    "& > a": {
      color: theme.palette.text.primary,
      textDecoration: "none",
    },
  },
  buttons: {
    "& > *": {
      margin: theme.spacing(1),
      textDecoration: "inherit",
    },
  },
  text: {
    color: theme.palette.text.primary,
    textDecoration: "none",
  },
}));

export default function MenuAppBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { user, signout } = useAuth();
  const navigate = useNavigate();

  // Is this the way?
  const matches = useMediaQuery("(min-width:600px)");
  const buttonSize = matches ? "medium" : "small";

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
    navigate("/");
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={toggleMenu}
            size="large">
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
                <MenuItem disabled onClick={handleClose}>
                  Profile
                </MenuItem>
                <MenuItem disabled onClick={handleClose}>
                  My account
                </MenuItem>
                <MenuItem onClick={logout}>Log out</MenuItem>
              </Menu>
            </div>
          ) : (
            <div className={classes.buttons}>
              <Link to="/signup">
                <Button variant="contained" size={buttonSize}>
                  Sign up
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="contained" color="primary" size={buttonSize}>
                  Log in
                </Button>
              </Link>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleMenu}>
        <List className={classes.list}>
          <Link to="/">
            <ListItem button onClick={toggleMenu}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
          </Link>
          {user?.room && (
            <Link to={`/room/${user.room}`}>
              <ListItem button onClick={toggleMenu}>
                <ListItemIcon>
                  <ChatIcon />
                </ListItemIcon>
                <ListItemText primary="My Room" />
              </ListItem>
            </Link>
          )}
        </List>
      </Drawer>
    </div>
  );
}
