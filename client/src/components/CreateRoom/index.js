import { useState } from "react";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";

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
        New Room
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
