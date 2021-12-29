import { useState, forwardRef, useMemo } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";

import AccountCircle from "@mui/icons-material/AccountCircle";
import ChatIcon from "@mui/icons-material/Chat";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";

// Why not?
import PropTypes from "prop-types";

import { useAuth } from "../libs/use-auth.js";

// This could be it's own file,
// make folder for the /appbar/index.js and /appbar/ListItemLink.js
function ListItemLink(props) {
  const { icon, primary, to, onClick } = props;

  const renderLink = useMemo(
    () =>
      forwardRef(function Link(itemProps, ref) {
        return <RouterLink to={to} ref={ref} {...itemProps} role={undefined} />;
      }),
    [to]
  );

  return (
    <li>
      <ListItemButton component={renderLink} onClick={onClick}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItemButton>
    </li>
  );
}
ListItemLink.propTypes = {
  icon: PropTypes.element,
  primary: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export default function MenuAppBar() {
  const { user, signout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Is this the way?
  const matches = useMediaQuery("(min-width:600px)");
  const buttonSize = matches ? "medium" : "small";

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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleMenu}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Photos
          </Typography>
          {user ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle sx={{ fontSize: 40 }} />
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
            <Stack spacing={2} direction="row">
              <Button
                component={RouterLink}
                variant="contained"
                to="signup"
                size={buttonSize}
              >
                Sign up
              </Button>
              <Button
                component={RouterLink}
                variant="contained"
                to="login"
                size={buttonSize}
              >
                Log in
              </Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleMenu}>
        <List sx={{ width: 250 }}>
          <ListItemLink
            to="/"
            onClick={toggleMenu}
            primary="Home"
            icon={<HomeIcon />}
          />
          {user?.room && (
            <ListItemLink
              to={`/room/${user.room}`}
              onClick={toggleMenu}
              primary="My Room"
              icon={<ChatIcon />}
            />
          )}
        </List>
      </Drawer>
    </Box>
  );
}
