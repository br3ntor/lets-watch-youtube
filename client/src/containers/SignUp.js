import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";

import { useFormFields } from "../libs/use-formFields";
import { useAuth } from "../libs/use-auth.js";

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    username: "",
    password: "",
  });
  const auth = useAuth();
  const navigate = useNavigate();

  async function submitCredentials(event) {
    event.preventDefault();
    setLoading(true);

    try {
      await auth.signup(fields.username, fields.password);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <AssignmentOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" onSubmit={submitCredentials} sx={{ mt: 1 }}>
          <TextField
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
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            onChange={handleFieldChange}
            value={fields.password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {!loading ? "Sign up" : <CircularProgress size={24} />}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
