import { useState } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

import ModalBody from "./ModalBody";

export default function SimpleModal() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleOpen}
      >
        Create My Room
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {ModalBody()}
      </Modal>
    </div>
  );
}
