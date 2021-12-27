import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { useFormFields } from "../libs/use-formFields";
import { useAuth } from "../libs/use-auth.js";

const PREFIX = "LogIn";

const classes = {
  paper: `${PREFIX}-paper`,
  avatar: `${PREFIX}-avatar`,
  form: `${PREFIX}-form`,
  submit: `${PREFIX}-submit`,
};

const StyledContainer = styled(Container)(({ theme }) => ({
  [`& .${classes.paper}`]: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  [`& .${classes.avatar}`]: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },

  [`& .${classes.form}`]: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },

  [`& .${classes.submit}`]: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function LogIn() {
  const [loading, setLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    username: "",
    password: "",
  });

  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function submitCredentials(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await auth.signin(fields.username, fields.password);
      const path = location.state?.from.pathname || "/";
      navigate(path);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <StyledContainer component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log in
        </Typography>
        <form onSubmit={submitCredentials} className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            onChange={handleFieldChange}
            value={fields.username}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleFieldChange}
            value={fields.password}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
          >
            {!loading ? "Log In" : <CircularProgress size={24} />}
          </Button>
        </form>
      </div>
    </StyledContainer>
  );
}
