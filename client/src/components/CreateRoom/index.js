import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { useFormFields } from "../../libs/use-formFields";
import { useAuth } from "../../libs/use-auth.js";

export default function FormDialog() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [fields, handleFieldChange] = useFormFields({
    name: `${user.name}'s Room`,
    url: "",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function createRoom(event) {
    event.preventDefault();
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": document.cookie.split("=")[1], // FIX: This only works if there is one cookie on document.cookie
        },
        body: JSON.stringify(fields),
      };
      const response = await fetch("/createroom", options);
      const room = await response.text();
      console.log(room);
      setUser((prev) => {
        return { ...prev, room: room };
      });
      navigate(`/room/${room}`);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Create My Room
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Create Room</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a video URL to start your room.
          </DialogContentText>
          <TextField
            fullWidth
            required
            label="Room Name"
            name="name"
            value={fields.name}
            onChange={handleFieldChange}
            variant="filled"
            margin="normal"
          />
          <TextField
            autoFocus
            fullWidth
            required
            label="Media URL"
            name="url"
            value={fields.url}
            onChange={handleFieldChange}
            variant="filled"
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="outlined" onClick={createRoom}>
            Create Room
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
